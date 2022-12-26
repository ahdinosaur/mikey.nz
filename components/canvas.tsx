import { Box } from '@chakra-ui/react'
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
    if (canvasEl == null) return

    const gl = context(canvasEl)
    const prog = program(gl, `
      precision mediump float;

      attribute vec2 position;

      void main() {
        gl_Position = vec4(position, 0, 1);
      }
    `, `
      precision mediump float;

      ${noise2dShader}
      ${hslShader}

      uniform vec2 u_resolution;
      uniform float u_time;

      void main () {
        vec2 coord = gl_FragCoord.xy / u_resolution;
        float time = u_time / 1000.0;
        vec3 pos = vec3(
          coord.x * 10.0,
          coord.y * 10.0,
          u_time / 1000.0
        );
        float value = mod(0.8 + cnoise(pos), 1.0);

        float hue = value;
        float saturation = 0.75;
        float brightness = 0.75;

        vec3 rgb = hsl2rgb(hue, saturation, brightness);

        gl_FragColor = vec4(rgb, 1.0);
      }
    `)
    attribute(
      gl,
      'position',
      [
        -1.0, -1.0,
        1.0, -1.0,
        -1.0, 1.0,
        -1.0, 1.0,
        1.0, -1.0,
        1.0, 1.0,
      ],
      prog
    )
    uniform(
      prog,
      'u_resolution',
      [1.0, 1.0],
    )
    uniform(
      prog,
      'u_time',
      {
        data: 0.0,
        type: gl.FLOAT
      },
    )

    glRef.current = gl
    progRef.current = prog
  }, [])

  useEffect(() => {
    const gl = glRef.current
    const prog = progRef.current
    if (gl == null) return

    updateSize()

    window.addEventListener('resize', updateSize)
    return () => {
      window.removeEventListener('resize', updateSize)
    }

    function updateSize() {
      const canvasEl = canvasRef.current
      if (canvasEl == null) return

      const mainEl = document.querySelector('main')
      if (mainEl == null) throw new Error('<main> not found')
      const mainRect = mainEl.getBoundingClientRect()

      /*
      const headerEl = document.querySelector('header#header')
      if (headerEl == null) throw new Error('<header> not found')
      const headerRect = headerEl.getBoundingClientRect()

      const footerEl = document.querySelector('footer#footer')
      if (footerEl == null) throw new Error('<footer> not found')
      const footerRect = footerEl.getBoundingClientRect()
      */

      canvasEl.style.display = 'block'
      canvasEl.style.position = 'absolute'
      canvasEl.style.top = `${mainRect.top}px`
      canvasEl.style.height = `${mainRect.height}px`
      canvasEl.style.left = '0px'
      canvasEl.style.right = '0px'
      canvasEl.style.width = '100vw'

      uniform(
        prog,
        'u_resolution',
        [mainRect.width, mainRect.height],
      )
    }
  }, [])

  useRaf((timeElapsed) => {
    const gl = glRef.current
    const prog = progRef.current
    if (gl == null) return

    uniform(
      prog,
      'u_time',
      {
        data: timeElapsed,
        type: gl.FLOAT,
      }
    )

    gl.drawArrays(gl.TRIANGLES, 0, 6)
  })

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'none'
      }}
    />
  )
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


// OR: https://github.com/patriciogonzalezvivo/lygia/blob/main/generative/cnoise.glsl

// https://github.com/hughsk/glsl-noise/blob/master/classic/3d.glsl
const noise2dShader = `
//
// GLSL textureless classic 3D noise "cnoise",
// with an RSL-style periodic variant "pnoise".
// Author:  Stefan Gustavson (stefan.gustavson@liu.se)
// Version: 2011-10-11
//
// Many thanks to Ian McEwan of Ashima Arts for the
// ideas for permutation and gradient selection.
//
// Copyright (c) 2011 Stefan Gustavson. All rights reserved.
// Distributed under the MIT license. See LICENSE file.
// https://github.com/ashima/webgl-noise
//

vec3 mod289(vec3 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
  return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

// Classic Perlin noise
float cnoise(vec3 P)
{
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}
`

// https://www.chilliant.com/rgb2hsv.html
const hslShader = `
vec3 saturate(vec3 rgb) {
  return clamp(rgb, 0.0, 1.0);
}

vec3 hue2rgb(float hue) {
  float r = abs(hue * 6. - 3.) - 1.;
  float g = 2. - abs(hue * 6. - 2.);
  float b = 2. - abs(hue * 6. - 4.);
  return saturate(vec3(r, g, b));
}

vec3 hsl2rgb(vec3 hsl) {
  vec3 rgb = hue2rgb(hsl.x);
  float c = (1. - abs(2. * hsl.z - 1.)) * hsl.y;
  return (rgb - 0.5) * c + hsl.z;
}

vec3 hsl2rgb(float h, float s, float l) {
    return hsl2rgb(vec3(h, s, l));
}
`

