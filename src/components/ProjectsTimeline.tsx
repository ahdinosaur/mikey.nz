// TODO
//
// - Need to compute earliest start of project
// - Algorithm to pack projects:
//   - First sort projects by start date
//   - For next project, find available slot
//     - A slot is available if the current project ends before the next project starts
//     - A slot is empty is undefined or null
//  - Placements
//    - Container is position="relative"
//    - Is it possible to place using position="absolute" and have a top value?
//    - Make-up a distance per day, based on base font-size.
//  - Should we pre-compute this data in a server component?

import { Box } from '@chakra-ui/react'
import {
  differenceInMilliseconds,
  differenceInSeconds,
  eachMonthOfInterval,
  endOfMonth,
  format as formatDate,
  getTime,
  startOfMonth,
} from 'date-fns'
import { keyBy, minBy } from 'es-toolkit'
import type { Project, Projects } from '@/util/projects'

export type ProjectsTimelineProps = {
  projects: Projects
}

type ProjectsById = Record<string, Project>

export function ProjectsTimeline(props: ProjectsTimelineProps) {
  const { projects } = props

  const earliestStart = getEarliestStart(projects)
  const now = new Date(Date.now())

  const laneIndexByProjectId = packProjectsToLanes(projects)
  const projectsById = keyBy(projects, (project) => project.id)

  return (
    <Box display="flex" flexDirection="row">
      <TimeMarkers start={earliestStart} end={now} />
      {
        //<ProjectMarkers laneIndexByProjectId={laneIndexByProjectId} projectsById={projectsById} />
      }
    </Box>
  )
}

export type TimeMarkersProps = {
  start: Date
  end: Date
}

export function TimeMarkers(props: TimeMarkersProps) {
  const { start, end } = props

  const distancePerDay = '2px'
  const distancePerSecond = `(${distancePerDay} / 86400)`

  const startMonth = startOfMonth(start)
  const endMonth = endOfMonth(end)

  return (
    <Box position="relative" display="flex" flexDirection="column" alignItems="flex-end">
      {eachMonthOfInterval({ start, end }).map((month) => {
        const monthId = month.getTime()
        const secondsFromEnd = differenceInSeconds(endMonth, month)
        return (
          <Box
            key={monthId}
            position="absolute"
            top={`calc(${distancePerSecond} * ${secondsFromEnd})`}
          >
            {formatDate(month, 'MMMM yyyy')}
          </Box>
        )
      })}
    </Box>
  )
}

export type ProjectMarkersProps = {}

export function ProjectMarkersProps(props: ProjectMarkersProps) {}

/* helper functions */

function getEarliestStart(projects: Projects): Date {
  const earliestStartProject = minBy(projects, (project) => getTime(project.meta.start))
  if (earliestStartProject == null) return new Date(Date.now())
  return earliestStartProject.meta.start
}

type CurrentLanes = Record<number, Project> // [index] -> [project]
type LaneIndexByProjectId = Record<string, number>

function packProjectsToLanes(projects: Projects): LaneIndexByProjectId {
  const currentLanes: CurrentLanes = {}
  const laneIndexByProjectId: LaneIndexByProjectId = {}

  // Sort by earliest start first
  const sortedProjects = projects.sort((a, b) => {
    // `(a, b) => a - b` sorts numbers in ascending order.
    return differenceInMilliseconds(b.meta.start, a.meta.start)
  })

  sortedProjects.forEach((project) => {
    const {
      meta: { id },
    } = project

    const nextLaneIndex = getNextAvailableLaneIndex(currentLanes, project)
    currentLanes[nextLaneIndex] = project
    laneIndexByProjectId[project.meta.id] = nextLaneIndex
  })

  return laneIndexByProjectId
}

// For next project, find available slot
// - A slot is empty is undefined or null
// - A slot is available if the current project ends before the next project starts
function getNextAvailableLaneIndex(currentLanes: CurrentLanes, nextProject: Project): number {
  for (let index = 0; ; index++) {
    if (currentLanes[index] == null) return index
    if (currentLanes[index].meta.end < nextProject.meta.start) return index
  }
}
