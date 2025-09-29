import { Box, Container, Heading } from '@chakra-ui/react'
import { useId } from 'react'
import { defaultComponents, Markdown } from '@/components/Markdown'
import {
  getProjects,
  type ProjectBody as ProjectBodyType,
  type ProjectMeta as ProjectMetaType,
  type Project as ProjectType,
} from '@/util/projects'

export default async function Page({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params

  const projects = await getProjects()
  const project = projects.find((project) => project.meta.id === projectId)

  if (project == null) return null

  return <Project project={project} />
}

type ProjectProps = {
  project: ProjectType
}

function Project(props: ProjectProps) {
  const { project } = props
  const { meta, body } = project

  const headingId = useId()

  return (
    <Container
      as="main"
      display="flex"
      flexDirection="column"
      flexGrow={1}
      gap={8}
      marginY={8}
      aria-labelledby={headingId}
    >
      <ProjectMeta meta={meta} headingId={headingId} />
      <ProjectBody body={body} />
    </Container>
  )
}

type ProjectMetaProps = {
  meta: ProjectMetaType
  headingId: string
}

function ProjectMeta(props: ProjectMetaProps) {
  const { meta, headingId } = props
  const { id, start, end } = meta

  return (
    <Box>
      <Heading as="h1" size="4xl" id={headingId} textAlign="center">
        {id}
      </Heading>
      {start.toDateString()} - {end?.toDateString() ?? 'present'}
    </Box>
  )
}

type ProjectBodyProps = {
  body: ProjectBodyType
}

function ProjectBody(props: ProjectBodyProps) {
  const { body } = props

  return (
    <Box>
      <Markdown components={defaultComponents}>{body}</Markdown>
    </Box>
  )
}
