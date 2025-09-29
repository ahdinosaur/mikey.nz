import { Box } from '@chakra-ui/react'
import {
  differenceInSeconds,
  eachMonthOfInterval,
  endOfMonth,
  format as formatDate,
  startOfMonth,
} from 'date-fns'
import { minBy } from 'es-toolkit'
import type { Project, Projects } from '@/util/projects'

export type NavigateToProject = (projectId: string) => void

export type ProjectsTimelineProps = {
  projects: Projects
  navigateToProject: NavigateToProject
}

const distancePerDay = '2px'
const distancePerSecond = `(${distancePerDay} / 86400)`

const NOW = new Date(Date.now())

export function ProjectsTimeline(props: ProjectsTimelineProps) {
  const { projects, navigateToProject } = props

  const start = getEarliestStart(projects)
  const end = NOW

  const startMonth = startOfMonth(start)
  const endMonth = endOfMonth(end)
  const totalSeconds = differenceInSeconds(endMonth, startMonth)

  const { laneIndexByProjectId, maxLanes } = packProjectsToLanes(projects)

  return (
    <Box
      display="flex"
      flexDirection="row"
      width="full"
      height={`calc(${totalSeconds} * ${distancePerSecond})`}
    >
      <TimeMarkers start={start} end={end} endMonth={endMonth} />
      <ProjectMarkers
        navigateToProject={navigateToProject}
        projects={projects}
        laneIndexByProjectId={laneIndexByProjectId}
        maxLanes={maxLanes}
        endMonth={endMonth}
      />
    </Box>
  )
}

export type TimeMarkersProps = {
  start: Date
  end: Date
  endMonth: Date
}

export function TimeMarkers(props: TimeMarkersProps) {
  const { start, end, endMonth } = props

  return (
    <Box
      position="relative"
      display="flex"
      flexDirection="column"
      alignItems="flex-end"
      textAlign="right"
      width="8rem"
    >
      <Box position="absolute" top={0} width="full" borderTop="md" />

      {eachMonthOfInterval({ start, end })
        .reverse()
        .map((monthStart) => {
          const monthId = monthStart.getTime()
          const monthEnd = endOfMonth(monthStart)
          const monthLabel = formatDate(monthStart, 'MMMM yyyy')

          const top = `calc(${distancePerSecond} * ${differenceInSeconds(endMonth, monthEnd)})`
          const height = `calc(${distancePerSecond} * ${differenceInSeconds(monthEnd, monthStart)})`

          return (
            <Box
              key={monthId}
              position="absolute"
              display="flex"
              alignItems="center"
              top={top}
              height={height}
              aria-label={monthLabel}
              borderBottom="md"
              width="full"
            >
              {monthLabel}
            </Box>
          )
        })}
    </Box>
  )
}

export type ProjectMarkersProps = {
  projects: Projects
  navigateToProject: NavigateToProject
  laneIndexByProjectId: LaneIndexByProjectId
  maxLanes: number
  endMonth: Date
}

const laneWidth = '2rem'
const laneMargin = '2rem'

export function ProjectMarkers(props: ProjectMarkersProps) {
  const { projects, navigateToProject, laneIndexByProjectId, maxLanes, endMonth } = props

  return (
    <Box
      position="relative"
      display="flex"
      flexDirection="column"
      alignItems="flex-end"
      width={`calc(${laneWidth} * ${maxLanes} + ${laneMargin} * ${maxLanes + 1})`}
    >
      {projects.map((project) => {
        const laneIndex = laneIndexByProjectId[project.meta.id]

        const secondsFromEnd = differenceInSeconds(endMonth, project.meta.end ?? NOW)
        const secondsLong = differenceInSeconds(project.meta.end ?? NOW, project.meta.start)

        return (
          <Box
            key={project.meta.id}
            backgroundColor={project.meta.color}
            position="absolute"
            top={`calc(${distancePerSecond} * ${secondsFromEnd})`}
            height={`calc(${distancePerSecond} * ${secondsLong})`}
            width={`calc(${laneWidth})`}
            left={`calc(${laneIndex} * ${laneWidth} + ${laneMargin} * ${laneIndex + 1})`}
            borderRadius="xl"
            onClick={(_ev) => navigateToProject(project.meta.id)}
          />
        )
      })}
    </Box>
  )
}

/* helper functions */

function getEarliestStart(projects: Projects): Date {
  const earliestStartProject = minBy(projects, (project) => project.meta.start.getTime())
  if (earliestStartProject == null) return NOW
  return earliestStartProject.meta.start
}

type CurrentLanes = Record<number, Project> // [index] -> [project]
type LaneIndexByProjectId = Record<string, number>

function packProjectsToLanes(projects: Projects): {
  laneIndexByProjectId: LaneIndexByProjectId
  maxLanes: number
} {
  const currentLanes: CurrentLanes = {}
  const laneIndexByProjectId: LaneIndexByProjectId = {}
  let maxLanes = 0

  // Sort by latest end first
  const projectsOrderedByLatestFirst = projects.sort((a, b) => {
    // `(a, b) => a - b` sorts numbers in ascending order.
    const aTime = (a.meta.end ?? NOW).getTime()
    const bTime = (b.meta.end ?? NOW).getTime()
    return bTime - aTime
  })

  projectsOrderedByLatestFirst.forEach((project) => {
    const nextLaneIndex = getNextAvailableLaneIndex(currentLanes, project)
    currentLanes[nextLaneIndex] = project
    laneIndexByProjectId[project.meta.id] = nextLaneIndex

    const numLanes = nextLaneIndex + 1
    if (numLanes > maxLanes) maxLanes = numLanes
  })

  return { laneIndexByProjectId, maxLanes }
}

// For next project, find available slot
// - A slot is empty is undefined or null
// - A slot is available if the current project starts after the next project ends
function getNextAvailableLaneIndex(currentLanes: CurrentLanes, nextProject: Project): number {
  for (let index = 0; ; index++) {
    if (currentLanes[index] == null) return index
    if (currentLanes[index].meta.start > (nextProject.meta.end ?? NOW)) return index
  }
}
