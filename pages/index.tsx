import { Inter } from '@next/font/google'
import Head from 'next/head'
import Image from 'next/image'
import { NextSeo } from 'next-seo'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <NextSeo />
      <main>
        Hi
      </main>
    </>
  )
}
