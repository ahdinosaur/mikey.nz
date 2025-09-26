import { Container, Heading } from '@chakra-ui/react'
import { useId } from 'react'
import ProjectsTimeline from '@/components/ProjectsTimeline'
import { getProjects } from '@/util/projects'

export default async function Page() {
  const headingId = useId()

  const projects = await getProjects()

  return (
    <Container
      as="main"
      display="flex"
      flexDirection="column"
      flexGrow={1}
      gap={8}
      marginY={8}
      aria-labelledby={headingId}
      maxW="xl"
    >
      <Heading as="h1" size="4xl" id={headingId} textAlign="center">
        My projects
      </Heading>

      <ProjectsTimeline projects={projects} />
    </Container>
  )
}

/*
import { Box, Container, Heading, List } from '@chakra-ui/react'
import { useId } from 'react'
import Markdown, { MarkdownAsync } from 'react-markdown'
import { defaultComponents } from '@/components/Markdown'
import ProjectsTimeline from '@/components/ProjectsTimeline'
import {
  getProjects,
  type ProjectBody as ProjectBodyType,
  type ProjectMeta as ProjectMetaType,
  type Projects as ProjectsType,
  type Project as ProjectType,
} from '@/util/projects'

type ProjectsProps = {
  projects: ProjectsType
}

function Projects(props: ProjectsProps) {
  const { projects } = props
  return (
    <List.Root>
      {projects.map((project) => (
        <Project key={project.meta.id} project={project} />
      ))}
    </List.Root>
  )
}

type ProjectProps = {
  project: ProjectType
}

function Project(props: ProjectProps) {
  const { project } = props
  const { meta, body } = project

  return (
    <Box>
      <ProjectMeta meta={meta} />
      <ProjectBody body={body} />
    </Box>
  )
}

type ProjectMetaProps = {
  meta: ProjectMetaType
}

function ProjectMeta(props: ProjectMetaProps) {
  const { meta } = props
  const { start, end } = meta

  return (
    <Box>
      {start.toDateString()} - {end.toDateString()}
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
*/
