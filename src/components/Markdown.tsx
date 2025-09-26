// Original source: https://github.com/mustaphaturhan/chakra-ui-markdown-renderer/
// Modified by hand and sloppified with ChatGPT 5

import {
  Checkbox,
  Code,
  chakra,
  Heading,
  Image,
  Link,
  List,
  Separator,
  Table,
  Text,
} from '@chakra-ui/react'
import type * as React from 'react'
import { type Components, MarkdownAsync } from 'react-markdown'

type GetCoreProps = {
  children?: React.ReactNode
  'data-sourcepos'?: any
}

function getCoreProps(props: GetCoreProps): any {
  return props['data-sourcepos'] ? { 'data-sourcepos': props['data-sourcepos'] } : {}
}

export const defaultComponents: Components = {
  p: (props) => {
    const { children } = props
    return <Text mb={2}>{children}</Text>
  },

  em: (props) => {
    const { children } = props
    return <Text as="em">{children}</Text>
  },

  blockquote: (props) => {
    const { children } = props
    return (
      <Code as="blockquote" p={2} display="block" w="full" whiteSpace="break-spaces">
        {children}
      </Code>
    )
  },

  code: (props) => {
    const { children, className } = props

    return (
      <Code className={className} whiteSpace="break-spaces" display="block" w="full" p={2}>
        {children}
      </Code>
    )
  },

  del: (props) => {
    const { children } = props
    return <Text as="del">{children}</Text>
  },

  hr: () => {
    return <Separator />
  },

  a: Link,

  img: (props) => {
    // react-markdown passes src/alt directly; Chakra Image supports native img props
    return <Image {...(props as any)} />
  },

  text: (props) => {
    const { children } = props
    return <Text as="span">{children}</Text>
  },

  ul: (props) => {
    const { ordered, children, depth } = props as any
    const attrs = getCoreProps(props as any)

    const styleType = ordered
      ? depth === 1
        ? 'lower-alpha'
        : 'decimal'
      : depth === 1
        ? 'circle'
        : 'disc'

    return (
      <List.Root as={ordered ? 'ol' : 'ul'} styleType={styleType} pl={4} gap={2} {...attrs}>
        {children}
      </List.Root>
    )
  },

  ol: (props) => {
    const { ordered, children, depth } = props as any
    const attrs = getCoreProps(props as any)

    const styleType = ordered
      ? depth === 1
        ? 'lower-alpha'
        : 'decimal'
      : depth === 1
        ? 'circle'
        : 'disc'

    return (
      <List.Root as={ordered ? 'ol' : 'ul'} styleType={styleType} pl={4} gap={2} {...attrs}>
        {children}
      </List.Root>
    )
  },

  li: (props) => {
    const { children, checked } = props as any

    if (checked !== null && checked !== undefined) {
      // v3 boolean props drop the "is" prefix (checked, readOnly)
      return (
        <List.Item listStyleType="none" {...getCoreProps(props as any)}>
          <Checkbox.Root checked={Boolean(checked)} readOnly>
            <Checkbox.HiddenInput />
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Label />
          </Checkbox.Root>
        </List.Item>
      )
    }

    return <List.Item {...getCoreProps(props as any)}>{children}</List.Item>
  },

  h1: (props) => (
    <Heading as="h1" size="2xl" my={4} {...getCoreProps(props as any)}>
      {props.children}
    </Heading>
  ),
  h2: (props) => (
    <Heading as="h2" size="xl" my={4} {...getCoreProps(props as any)}>
      {props.children}
    </Heading>
  ),
  h3: (props) => (
    <Heading as="h3" size="lg" my={4} {...getCoreProps(props as any)}>
      {props.children}
    </Heading>
  ),
  h4: (props) => (
    <Heading as="h4" size="md" my={4} {...getCoreProps(props as any)}>
      {props.children}
    </Heading>
  ),
  h5: (props) => (
    <Heading as="h5" size="sm" my={4} {...getCoreProps(props as any)}>
      {props.children}
    </Heading>
  ),
  h6: (props) => (
    <Heading as="h6" size="xs" my={4} {...getCoreProps(props as any)}>
      {props.children}
    </Heading>
  ),

  pre: (props) => {
    const { children } = props
    return <chakra.pre {...getCoreProps(props as any)}>{children}</chakra.pre>
  },

  table: (props) => <Table.Root {...(props as any)} />,
  thead: (props) => <Table.Header {...(props as any)} />,
  tbody: (props) => <Table.Body {...(props as any)} />,
  tr: (props) => <Table.Row {...(props as any)} />,
  th: (props) => <Table.ColumnHeader {...(props as any)} />,
  td: (props) => <Table.Cell {...(props as any)} />,
}

type MarkdownProps = {
  components?: Components
  children: string
}

export function Markdown(props: MarkdownProps) {
  const { components, children } = props
  return <MarkdownAsync components={components}>{children}</MarkdownAsync>
}
