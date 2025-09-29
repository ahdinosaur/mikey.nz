import { Box, Container, Heading, List } from '@chakra-ui/react'
import { useCallback, useId } from 'react'
import Markdown, { MarkdownAsync } from 'react-markdown'
import { defaultComponents } from '@/components/Markdown'
import { ProjectsTimeline } from '@/components/ProjectsTimeline'
import {
  getProjects,
  type ProjectBody as ProjectBodyType,
  type ProjectMeta as ProjectMetaType,
  type Projects as ProjectsType,
  type Project as ProjectType,
} from '@/util/projects'

export default async function Page() {
  const headingId = useId()

  const projects = await getProjects()

  const navigateToProject = useCallback((projectId) => {


  }, [])

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
      <Heading as="h1" size="4xl" id={headingId} textAlign="center">
        My projects
      </Heading>

      <ProjectsTimeline projects={projects} />
    </Container>
  )
}

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
