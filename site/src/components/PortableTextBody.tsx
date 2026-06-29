import {PortableText, type PortableTextComponents} from '@portabletext/react'
import type {PortableTextBlock} from '@portabletext/react'

const components: PortableTextComponents = {
  marks: {
    link: ({value, children}) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
}

export default function PortableTextBody({value}: {value: PortableTextBlock[]}) {
  return (
    <article
      className="prose md:prose-lg max-w-none leading-loose
        prose-headings:font-black prose-headings:uppercase
        prose-h2:text-2xl prose-h2:border-b-2 prose-h2:border-black prose-h2:pb-2
        prose-h3:text-xl
        prose-a:text-accent prose-a:no-underline hover:prose-a:underline
        prose-strong:font-black"
    >
      <PortableText value={value} components={components} />
    </article>
  )
}
