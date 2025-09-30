import { promises as fs } from 'node:fs'
import { join } from 'node:path'
// @ts-expect-error
import randomColor from 'randomcolor'
import { parse as parseYaml } from 'yaml'
import { z } from 'zod'

/*

Example projects.md:

```
---
id: first
label: First project
icon: fa/FaFileExcel
start: 2025-07-20
end: 2025-09-26
---

Hi I'm a project

---
id: second
label: Second project
icon: ai/AiFillAndroid
start: 2025-05-17
end: 2025-08-23
---

Another project?

---
id: third
label: Third project
icon: di/DiBootstrap
start: 2025-02-17
end: 2025-06-12
---

Another project?

---
id: fourth
label: Fourth project
icon: di/DiBootstrap
start: 2024-02-17
end: 2025-06-12
---

Another project?
```

*/

export type ProjectMeta = {
  id: string
  start: Date
  end: Date | null
  color: string
  icon: string | null
}

export type ProjectBody = string

export type Project = {
  meta: ProjectMeta
  body: ProjectBody
}

export type Projects = Array<Project>

const ProjectMetaSchema = z
  .object({
    id: z.string().min(1, 'id must be a non-empty string'),
    start: z.preprocess(
      (v) => (typeof v === 'string' || v instanceof Date ? new Date(v) : v),
      z.date({ error: 'start date is required' }),
    ),
    end: z
      .union([
        z.preprocess(
          (v) =>
            v === undefined || v === null
              ? null
              : typeof v === 'string' || v instanceof Date
                ? new Date(v)
                : v,
          z.date(),
        ),
        z.null(),
      ])
      .default(null),
    color: z.string().default(() => randomColor()),
    icon: z.string().nullable().default(null),
  })
  .refine((data) => data.end === null || data.start <= data.end, {
    path: ['end'],
    message: `'end' must be on or after 'start' date.`,
  })

export async function getProjects(): Promise<Projects> {
  const cwd = process.cwd()
  const projectsDataPath = join(cwd, 'src/projects.md')
  const projectsData = await fs.readFile(projectsDataPath, 'utf8')
  return parseProjects(projectsData)
}

function parseProjects(data: string): Projects {
  const text = data.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n')
  const lines = text.split('\n')
  const len = lines.length

  const projects: Projects = []

  const isDelim = (line: string) => line.trim() === '---'
  const isBlank = (line: string) => /^\s*$/.test(line)

  const skipBlank = (i: number) => {
    while (i < len && isBlank(lines[i])) i++
    return i
  }

  // Handles skipping code fences properly
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
      throw new Error(
        `Expected '---' to start project frontmatter at line ${pos + 1}, but found: ${
          lines[pos] || '(empty line)'
        }.`,
      )
    }

    const fmStart = pos
    let fmEnd = -1

    for (let i = fmStart + 1; i < len; i++) {
      if (isDelim(lines[i])) {
        fmEnd = i
        break
      }
    }
    if (fmEnd === -1) {
      throw new Error(`Unclosed frontmatter starting at line ${fmStart + 1}. Add a matching '---'.`)
    }

    const yamlText = lines
      .slice(fmStart + 1, fmEnd)
      .join('\n')
      .trim()
    if (!yamlText) {
      throw new Error(
        `Empty frontmatter at lines ${fmStart + 1}-${fmEnd + 1}. Expected at least 'id' and 'start'.`,
      )
    }

    let parsedYaml: unknown
    try {
      parsedYaml = parseYaml(yamlText)
    } catch (e: any) {
      throw new Error(`Invalid YAML at lines ${fmStart + 1}-${fmEnd + 1}.\n${e?.message || e}`)
    }

    // ✅ Validate with schema
    const meta = ProjectMetaSchema.parse(parsedYaml)

    // Body → everything until next frontmatter or EOF
    const bodyStart = fmEnd + 1
    let nextStart = findNextDelim(bodyStart)
    if (nextStart === -1) nextStart = len

    const body = lines.slice(bodyStart, nextStart).join('\n').trim()

    projects.push({ meta, body })
    pos = nextStart
  }

  if (projects.length === 0) {
    throw new Error(`No projects found. Provide at least one '---' YAML block.`)
  }

  return projects
}
