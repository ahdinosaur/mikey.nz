export function randomColor(id: string): string {
  const rng = mulberry32(hash32(id))
  const h = Math.floor(rng() * 360)
  const s = Math.floor(60 + rng() * 20) // 60–79 (vibrant)
  const l = Math.floor(45 + rng() * 15) // 45–59 (balanced)
  return hslToHex(h, s, l)
}

function hash32(str: string): number {
  // FNV-1a 32-bit
  let h = 2166136261 >>> 0
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(a: number) {
  return (): number => {
    let t = a
    a += 0x6d2b79f5
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hslToHex(h: number, s: number, l: number): string {
  const c = (1 - Math.abs(2 * (l / 100) - 1)) * (s / 100)
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l / 100 - c / 2

  let r = 0,
    g = 0,
    b = 0

  if (0 <= h && h < 60) [r, g, b] = [c, x, 0]
  else if (60 <= h && h < 120) [r, g, b] = [x, c, 0]
  else if (120 <= h && h < 180) [r, g, b] = [0, c, x]
  else if (180 <= h && h < 240) [r, g, b] = [0, x, c]
  else if (240 <= h && h < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]

  const to255 = (v: number) => Math.round((v + m) * 255)
  const toHex = (v: number) => v.toString(16).padStart(2, '0')

  return `#${toHex(to255(r))}${toHex(to255(g))}${toHex(to255(b))}`
}
