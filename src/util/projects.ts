import { promises as fs } from 'node:fs'
import { join } from 'node:path'
// @ts-expect-error
import randomColor from 'randomcolor'
import { parse as parseYaml } from 'yaml'

/*

Example projects.md:

```
---
id: first
start: 2025-09-20
end: 2025-09-26
---

Hi I'm a project

---
id: another
start: 2025-09-17
end: 2025-09-23
---

Another project?
```

*/

export type ProjectMeta = {
  id: string
  start: Date
  end: Date | null
  color: string
}

export type ProjectBody = string

export type Project = {
  meta: ProjectMeta
  body: ProjectBody
}

export type Projects = Array<Project>

export async function getProjects(): Promise<Projects> {
  const cwd = process.cwd()
  const projectsDataPath = join(cwd, 'src/projects.md')
  const projectsData = await fs.readFile(projectsDataPath, 'utf8')
  return parseProjects(projectsData)
}

export function parseProjects(data: string): Projects {
  const text = data.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n')
  const lines = text.split('\n')
  const len = lines.length

  const projects: Projects = []

  const isDelim = (line: string) => line.trim() === '---'
  const isBlank = (line: string) => /^\s*$/.test(line)

  const skipBlank = (start: number) => {
    let i = start
    while (i < len && isBlank(lines[i])) i++
    return i
  }

  const findNextDelim = (start: number) => {
    let fenceChar: '`' | '~' | null = null
    let fenceLen = 0

    for (let i = start; i < len; i++) {
      const line = lines[i]
      const m = line.match(/^\s*([`~]{3,})/)
      if (m) {
        const c = m[1][0] as '`' | '~'
        const l = m[1].length
        if (!fenceChar) {
          fenceChar = c
          fenceLen = l
        } else if (c === fenceChar && l >= fenceLen) {
          fenceChar = null
          fenceLen = 0
        }
      }
      if (!fenceChar && isDelim(line)) return i
    }
    return -1
  }

  let pos = 0

  while (true) {
    pos = skipBlank(pos)
    if (pos >= len) break

    if (!isDelim(lines[pos])) {
      const found = lines[pos] || '(empty line)'
      throw new Error(
        `Expected '---' to start project frontmatter at line ${pos + 1}, ` +
          `but found: ${found}. Each project must begin with a YAML ` +
          `frontmatter block delimited by '---'.`,
      )
    }

    const fmStart = pos

    // Find closing '---' for the frontmatter.
    let fmEnd = -1
    for (let i = fmStart + 1; i < len; i++) {
      if (isDelim(lines[i])) {
        fmEnd = i
        break
      }
    }
    if (fmEnd === -1) {
      throw new Error(
        `Unclosed frontmatter starting at line ${fmStart + 1}. ` +
          `Add a matching '---' to close the YAML block.`,
      )
    }

    const yamlText = lines
      .slice(fmStart + 1, fmEnd)
      .join('\n')
      .trim()
    if (!yamlText) {
      throw new Error(
        `Empty frontmatter at lines ${fmStart + 1}-${fmEnd + 1}. ` +
          `Provide at least 'start' and 'end' fields.`,
      )
    }

    let raw: unknown
    try {
      raw = parseYaml(yamlText)
    } catch (e: any) {
      const message = e?.message || String(e)
      throw new Error(
        `Invalid YAML in frontmatter starting at line ${fmStart + 1}.\n` +
          `${message}\n` +
          `If this '---' was meant as a horizontal rule, indent it by a ` +
          `space or use '***' instead.`,
      )
    }

    if (typeof raw !== 'object' || raw === null) {
      throw new Error(`Frontmatter at lines ${fmStart + 1}-${fmEnd + 1} must be a YAML mapping.`)
    }

    const makeId = (value: unknown, field: 'id'): string => {
      if (typeof value !== 'string') {
        throw new Error(
          `Invalid '${field}' in frontmatter at lines ` +
            `${fmStart + 1}-${fmEnd + 1}. ` +
            `Expected a valid string`,
        )
      }
      return value
    }

    const makeDate = (value: unknown, field: 'start' | 'end'): Date => {
      let d: Date | null = null
      if (value instanceof Date) {
        d = value
      } else if (typeof value === 'string' || typeof value === 'number') {
        d = new Date(value as any)
      }
      if (!d || Number.isNaN(d.getTime())) {
        throw new Error(
          `Invalid '${field}' in frontmatter at lines ` +
            `${fmStart + 1}-${fmEnd + 1}. ` +
            `Expected a valid date string (e.g. 2020-01-31).`,
        )
      }
      return d
    }

    const obj = raw as Record<string, unknown>

    if (!('id' in obj && 'start' in obj && 'end' in obj)) {
      throw new Error(
        `Missing required 'id', 'start', and 'end' in frontmatter at lines ` +
          `${fmStart + 1}-${fmEnd + 1}.`,
      )
    }

    const id = makeId(obj.id, 'id')
    const start = makeDate(obj.start, 'start')
    const end = makeDate(obj.end, 'end')
    const color = obj.color ?? randomColor()

    if (start.getTime() > end.getTime()) {
      throw new Error(
        `In frontmatter at lines ${fmStart + 1}-${fmEnd + 1}: 'start' ` +
          `must be on or before 'end'.`,
      )
    }

    // Body is everything until the next non-fenced '---' or EOF.
    const bodyStart = fmEnd + 1
    let nextStart = findNextDelim(bodyStart)
    if (nextStart === -1) nextStart = len

    const body = lines.slice(bodyStart, nextStart).join('\n')

    projects.push({
      meta: { id, start, end, color },
      body,
    })

    pos = nextStart // continue parsing from the next '---'
  }

  if (projects.length === 0) {
    throw new Error(`No projects found. Expected at least one '---' YAML frontmatter block.`)
  }

  return projects
}
