import Image from 'next/image'
import { NextSeo } from 'next-seo'
import { Box } from '@chakra-ui/react'

import Profile from '../images/mikey-square.jpg'
import { Canvas } from '../components/canvas'
import { RefObject, useEffect, useRef, useState } from 'react'

export default function Home() {
  return (
    <>
      <NextSeo />
      <Box
        as="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
        }}
      >
        <Canvas />
        <Avatar />

      </Box>
    </>
  )
}

function Avatar() {
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          display: 'block',
          position: 'relative',
          width: '50%',
          maxWidth: '50vh',
        }}
      >
        <AvatarImage />
      </Box>
    </Box>
  )
}

function AvatarImage() {
  const imageRef = useRef(null)

  const [supportsBackdrop, setSupportsBackdrop] = useState(false)
  useEffect(() => {
    if (CSS.supports("backdrop-filter", "blur(10px)")) {
      setSupportsBackdrop(true)
    }
  }, [])

  return (
    <>
      {supportsBackdrop && (
        <AvatarBackdrop imageRef={imageRef} />
      )}
      <Image
        src={Profile}
        alt={"Photo of Mikey in Glenorchy, New Zealand"}
        ref={imageRef}
        priority
        placeholder='blur'
        sizes='50vw'
        style={{
          position: 'relative',
          borderRadius: '50%',
          objectFit: 'contain',
          maxHeight: '100%',
          zIndex: 2,
        }}
      />
    </>
  )
}

type AvatarBackdropProps = {
  imageRef: RefObject<HTMLElement>
}

function AvatarBackdrop(props: AvatarBackdropProps) {
  const { imageRef } = props
  const dimensions = useDimensions(imageRef)

  if (dimensions == null) return null
  const { top, right, bottom, left, width, height } = dimensions

  return (
    <Box
      sx={{
        position: 'fixed',
        top: top - (0.5 * height),
        right: right + (0.5 * width),
        bottom: bottom + (0.5 * height),
        left: left - (0.5 * width),
        width: width * 2,
        height: height * 2,
        backdropFilter: 'sepia(50%) blur(12px)',
        maskImage: `radial-gradient(
          circle,
          rgba(0, 0, 0, 1) 40%, /* Effect is solid up to the image edge */
          rgba(0, 0, 0, 0) 75% /* Fades to transparent at the aura's outer edge */
        )`,
        zIndex: 1,
      }}
    />
  )
}

type Dimensions = {
  top: number
  right: number
  bottom: number
  left: number
  width: number
  height: number
}

export function useDimensions(elementRef: RefObject<HTMLElement>) {
  const [dimensions, setDimensions] = useState<Dimensions | null>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const updateDimensions = () => {
      const rect = element.getBoundingClientRect()
      setDimensions({
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      })
    }

    updateDimensions()

    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(updateDimensions)
      resizeObserver.observe(element)
      return () => { resizeObserver.disconnect() }
    } else {
      window.addEventListener('resize', updateDimensions)
      return () => {
        window.removeEventListener('resize', updateDimensions)
      }
    }
  }, [elementRef])

  return dimensions
}
