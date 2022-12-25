import React, { useMemo, useEffect, useRef } from 'react'
// @ts-ignore
import { context, program, attribute, uniform } from 'gl-util'

export interface CanvasProps {}

export function Canvas(props: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glRef = useRef<any>(null)
  const progRef = useRef<any>(null)

  useEffect(() => {
    const canvasEl = canvasRef.current

    const gl = context(canvasEl)
    const prog = program(gl, `
      precision mediump float;

      attribute vec2 position;

      void main() {
        gl_Position = vec4(position * 2. - 1., 0, 1);
      }
    `, `
      precision mediump float;

      uniform vec4 color;

      void main () {
        gl_FragColor = color;
      }
    `)
    attribute(gl, 'position', [0,0, 1,0, 0,1], prog) 
    uniform(prog, 'color', [1, .2, 0, 1.])

    glRef.current = gl
    progRef.current = prog
  }, [])

  useRaf((_timeElapsed) => {
    const gl = glRef.current
    const prog = progRef.current
    if (gl == null) return

    gl.drawArrays(gl.TRIANGLES, 0, 3)
  })

  return <canvas ref={canvasRef} />
}


export function useRaf(
  callback: (timeElapsed: DOMHighResTimeStamp) => void,
): void {
  useEffect(() => {
    const raf = window.requestAnimationFrame

    let isActive = true
    
    raf(loop)

    return () => {
      isActive = false
    }

    function loop(time: DOMHighResTimeStamp) {
      if (!isActive) return

      callback(time)

      raf(loop)
    }
  }, [callback])
}
