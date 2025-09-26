'use client'

import {
  Box,
  Button,
  Drawer,
  type DrawerOpenChangeDetails,
  Flex,
  Text,
  useBreakpointValue,
  useToken,
  VisuallyHidden,
} from '@chakra-ui/react'
import type React from 'react'
import { useCallback, useMemo, useState } from 'react'
import Markdown from 'react-markdown'
import { defaultComponents } from '@/components/Markdown'
import type { Project, Projects } from '@/util/projects'

type ProjectsTimelineProps = {
  projects: Projects
}

// Utility date helpers
const MS_PER_DAY = 24 * 60 * 60 * 1000

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0)
}

function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1, 0, 0, 0, 0)
}

function daysInMonth(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
}

function monthsBetweenInclusive(a: Date, b: Date): number {
  // a and b should be first of month
  return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()) + 1
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}

// Formatting helpers
const fmtMonth = new Intl.DateTimeFormat(undefined, { month: 'short' })
const fmtMonthYear = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  year: 'numeric',
})
const fmtFullDate = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

type MonthTick = {
  date: Date // first day of month
  y: number // top of the month row
  label: string
  isYearStart: boolean
}

function packProjects(projects: Projects): {
  byId: Record<string, number>
  laneCount: number
} {
  // Sort by start ascending
  const sorted = [...projects].sort((a, b) => a.meta.start.getTime() - b.meta.start.getTime())

  type Lane = { lastEnd: Date }
  const lanes: Lane[] = []
  const byId: Record<string, number> = {}

  for (const p of sorted) {
    let assigned = -1
    for (let i = 0; i < lanes.length; i++) {
      // A lane is free if the last project's end is strictly before this start.
      if (lanes[i].lastEnd.getTime() <= p.meta.start.getTime()) {
        assigned = i
        break
      }
    }
    if (assigned === -1) {
      assigned = lanes.length
      lanes.push({ lastEnd: p.meta.end })
    } else {
      lanes[assigned].lastEnd = p.meta.end
    }
    byId[p.meta.id] = assigned
  }

  return { byId, laneCount: lanes.length }
}

function useTimelineGeometry(projects: Projects) {
  const now = useMemo(() => new Date(), [])
  const earliestStart = useMemo(() => {
    if (projects.length === 0) return now
    return projects.reduce((min, p) => {
      return p.meta.start < min ? p.meta.start : min
    }, projects[0].meta.start)
  }, [projects, now])

  const monthRowH = useBreakpointValue({ base: 44, md: 56 }) ?? 56
  const laneW = useBreakpointValue({ base: 72, md: 96 }) ?? 96
  const laneGutter = useBreakpointValue({ base: 12, md: 16 }) ?? 16
  const iconSize = useBreakpointValue({ base: 18, md: 22 }) ?? 20

  const startMonth = startOfMonth(earliestStart)
  const endMonth = startOfMonth(now)
  const monthCount = monthsBetweenInclusive(startMonth, endMonth)

  const months: MonthTick[] = useMemo(() => {
    const arr: MonthTick[] = []
    for (let i = 0; i < monthCount; i++) {
      const mDate = addMonths(startMonth, i)
      const isYearStart = mDate.getMonth() === 0
      const label = isYearStart ? fmtMonthYear.format(mDate) : fmtMonth.format(mDate)
      arr.push({
        date: mDate,
        y: i * monthRowH,
        label,
        isYearStart,
      })
    }
    return arr
  }, [monthCount, monthRowH, startMonth])

  const totalHeight = useMemo(() => {
    // Height goes up to "now" inside the last month row
    const base = (monthCount - 1) * monthRowH
    const monthStart = startMonth
    const monthsDiff =
      (endMonth.getFullYear() - monthStart.getFullYear()) * 12 +
      (endMonth.getMonth() - monthStart.getMonth())

    const thisMonthStart = addMonths(monthStart, monthsDiff)
    const dayFrac =
      (now.getTime() - thisMonthStart.getTime()) / (daysInMonth(thisMonthStart) * MS_PER_DAY)
    const frac = clamp(dayFrac, 0, 1)
    return base + frac * monthRowH
  }, [monthCount, monthRowH, endMonth, startMonth, now])

  function yForDate(d: Date): number {
    const dStartMonth = startOfMonth(d)
    const monthsDiff =
      (dStartMonth.getFullYear() - startMonth.getFullYear()) * 12 +
      (dStartMonth.getMonth() - startMonth.getMonth())
    const base = clamp(monthsDiff, 0, monthCount - 1) * monthRowH
    const mStart = addMonths(startMonth, clamp(monthsDiff, 0, monthCount - 1))
    const frac = (d.getTime() - mStart.getTime()) / (daysInMonth(mStart) * MS_PER_DAY)
    return base + clamp(frac, 0, 1) * monthRowH
  }

  const nowY = yForDate(now)

  const packing = useMemo(() => packProjects(projects), [projects])

  return {
    months,
    totalHeight,
    yForDate,
    nowY,
    laneW,
    laneGutter,
    iconSize,
    laneCount: packing.laneCount,
    laneIndexById: packing.byId,
  }
}

type DetailsState = {
  project: Project | null
}

export default function ProjectsTimeline(props: ProjectsTimelineProps) {
  const { projects } = props
  const {
    months,
    totalHeight,
    yForDate,
    nowY,
    laneW,
    laneGutter,
    iconSize,
    laneCount,
    laneIndexById,
  } = useTimelineGeometry(projects)

  const [selected, setSelected] = useState<DetailsState>({
    project: null,
  })
  const [open, setOpen] = useState(false)
  const [mutedText] = useToken('colors', ['gray.500'])

  const handleSelect = useCallback((p: Project) => {
    setSelected({ project: p })
    setOpen(true)
  }, [])

  return (
    <Flex direction="column" gap={4}>
      {/* Timeline container with vertical scroll */}
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        bg="white"
        _dark={{ bg: 'gray.800', borderColor: 'whiteAlpha.300' }}
      >
        <Flex
          // Two columns: time axis (fixed) + lanes (horizontal scrollable)
          direction="row"
          align="stretch"
          css={{ gap: 0 }}
          maxH="70vh"
          overflow="hidden"
        >
          {/* Time Axis */}
          <Box
            position="relative"
            minW={{ base: '64px', md: '88px' }}
            flex="0 0 auto"
            borderRightWidth="1px"
            _dark={{ borderColor: 'whiteAlpha.300' }}
          >
            <Box position="relative" height={`${totalHeight}px`} overflow="auto">
              {/* Axis labels */}
              {months.map((m) => (
                <Box
                  key={m.date.toISOString()}
                  position="absolute"
                  top={`${m.y}px`}
                  left={0}
                  right={0}
                  px={2}
                  py={1}
                >
                  <Text
                    fontSize={{ base: 'xs', md: 'sm' }}
                    color={m.isYearStart ? 'fg' : mutedText}
                    fontWeight={m.isYearStart ? 'semibold' : 'medium'}
                  >
                    {m.label}
                  </Text>
                </Box>
              ))}
              {/* "Now" tick label */}
              <Box
                position="absolute"
                top={`${nowY}px`}
                left={0}
                right={0}
                px={2}
                transform="translateY(-1px)"
              >
                <Text fontSize={{ base: 'xs', md: 'sm' }} color="blue.500">
                  Now
                </Text>
              </Box>
            </Box>
          </Box>

          {/* Lanes area */}
          <Box position="relative" flex="1 1 auto" overflowX="auto" overflowY="auto">
            <Box
              position="relative"
              height={`${totalHeight}px`}
              width={`${
                Math.max(1, laneCount) * laneW + Math.max(0, laneCount - 1) * laneGutter
              }px`}
            >
              {/* Month grid lines */}
              {months.map((m) => (
                <Box
                  key={`grid-${m.date.toISOString()}`}
                  position="absolute"
                  top={`${m.y}px`}
                  left={0}
                  right={0}
                  height="1px"
                  bg="blackAlpha.200"
                  _dark={{ bg: 'whiteAlpha.200' }}
                />
              ))}

              {/* "Now" horizontal marker */}
              <Box
                position="absolute"
                top={`${nowY}px`}
                left={0}
                right={0}
                height="2px"
                bg="blue.400"
                opacity={0.8}
              />

              {/* Projects as lanes */}
              {projects.map((p) => {
                const laneIndex = laneIndexById[p.meta.id] ?? 0
                const topY = yForDate(p.meta.start)
                const endY = yForDate(p.meta.end)
                const clampedEnd = clamp(endY, 0, totalHeight)
                const height = Math.max(12, clampedEnd - topY)

                const IconComp = p.meta.icon as React.ComponentType<{
                  size?: number | string
                }>

                const isSelected = selected.project?.meta.id === p.meta.id

                return (
                  <Box
                    key={p.meta.id}
                    position="absolute"
                    top={`${topY}px`}
                    left={`${laneIndex * (laneW + laneGutter)}px`}
                    width={`${laneW}px`}
                    height={`${height}px`}
                    // This wrapper defines the sticky boundary for the icon
                  >
                    {/* Click target */}
                    <Button
                      unstyled
                      onClick={() => handleSelect(p)}
                      position="absolute"
                      top={0}
                      left={0}
                      width="100%"
                      height="100%"
                      cursor="pointer"
                      aria-label={`Open project ${p.meta.id}`}
                      aria-expanded={isSelected}
                      _focusVisible={{
                        boxShadow: '0 0 0 2px',
                        outline: 'none',
                        borderRadius: 'md',
                      }}
                    >
                      <VisuallyHidden>Open details for {p.meta.id}</VisuallyHidden>
                    </Button>

                    {/* Vertical line */}
                    <Box
                      position="absolute"
                      top={0}
                      left={`${laneW / 2 - 1}px`}
                      width="2px"
                      height="100%"
                      bg={isSelected ? 'blue.400' : 'gray.400'}
                      _dark={{
                        bg: isSelected ? 'blue.300' : 'gray.500',
                      }}
                      borderRadius="full"
                    />

                    {/* Sticky icon at the top */}
                    <Flex
                      position="sticky"
                      top={0}
                      zIndex={2}
                      transform="translateY(-50%)"
                      align="center"
                      justify="center"
                    >
                      <Flex
                        align="center"
                        justify="center"
                        width={`${Math.max(28, iconSize + 14)}px`}
                        height={`${Math.max(28, iconSize + 14)}px`}
                        borderRadius="full"
                        bg="white"
                        _dark={{ bg: 'gray.800' }}
                        borderWidth="2px"
                        borderColor={isSelected ? 'blue.400' : 'gray.300'}
                        boxShadow="sm"
                      >
                        {IconComp ? (
                          <IconComp size={iconSize} />
                        ) : (
                          <Box
                            width={`${iconSize}px`}
                            height={`${iconSize}px`}
                            bg="gray.400"
                            borderRadius="sm"
                          />
                        )}
                      </Flex>
                    </Flex>

                    {/* Dates mini label near the top of the line (optional) */}
                    <Box
                      position="absolute"
                      top={0}
                      left="calc(50% + 8px)"
                      transform="translateY(-50%)"
                      px={2}
                      py={0.5}
                      bg="blackAlpha.50"
                      _dark={{ bg: 'whiteAlpha.100' }}
                      borderRadius="md"
                    >
                      <Text fontSize="xs" color="fg.muted">
                        {fmtFullDate.format(p.meta.start)}
                      </Text>
                    </Box>

                    {/* End date marker (optional) */}
                    <Box
                      position="absolute"
                      bottom="-8px"
                      left={`${laneW / 2 - 3}px`}
                      width="6px"
                      height="6px"
                      borderRadius="full"
                      bg="gray.500"
                      _dark={{ bg: 'gray.400' }}
                    />
                  </Box>
                )
              })}
            </Box>
          </Box>
        </Flex>
      </Box>

      {/* Details Drawer */}
      <ProjectDetailsDrawer open={open} setOpen={setOpen} project={selected.project} />
    </Flex>
  )
}

type ProjectDetailsDrawerProps = {
  open: boolean
  setOpen: (open: boolean) => void
  project: Project | null
}

function ProjectDetailsDrawer(props: ProjectDetailsDrawerProps) {
  const { open, setOpen, project } = props

  const placement = useBreakpointValue<'end' | 'bottom'>({
    base: 'bottom',
    md: 'end',
  })

  const onOpenChange = useCallback(
    (details: DrawerOpenChangeDetails) => setOpen(details.open),
    [setOpen],
  )

  if (!project) return null

  const IconComp = project.meta.icon as React.ComponentType<{
    size?: number | string
  }>

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} placement={placement}>
      <Drawer.Backdrop />
      <Drawer.Trigger />
      <Drawer.Positioner>
        <Drawer.Content>
          <Drawer.CloseTrigger />
          <Drawer.Header display="flex" alignItems="center" gap={3}>
            <Flex
              align="center"
              justify="center"
              width="36px"
              height="36px"
              borderRadius="full"
              bg="blackAlpha.50"
              _dark={{ bg: 'whiteAlpha.100' }}
            >
              {IconComp ? <IconComp size={20} /> : null}
            </Flex>
            <Drawer.Title>
              <Flex direction="column">
                <Text fontWeight="semibold">{project.meta.id}</Text>
                <Text fontSize="sm" color="fg.muted">
                  {fmtFullDate.format(project.meta.start)} – {fmtFullDate.format(project.meta.end)}
                </Text>
              </Flex>
            </Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <Markdown components={defaultComponents}>{project.body}</Markdown>
          </Drawer.Body>
          <Drawer.Footer />
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  )
}
