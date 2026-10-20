import './TypographySection.css'

type Props = {
  /** Three words pinned to the corners of the frame: top-left, mid-right, bottom-left. */
  words: readonly [string, string, string]
  caption?: string
  id?: string
  /** Heading level; the opening statement is the page's h1. */
  as?: 'h1' | 'h2'
  /** Read by screen readers before the words (e.g. the practice name). */
  srPrefix?: string
}

/** Full-viewport corner-statement layout: three words pinned to the corners of the frame. */
export default function TypographySection({ words, caption, id, as: Heading = 'h2', srPrefix }: Props) {
  const [first, middle, last] = words

  return (
    <div id={id} className="type-section">
      <Heading className="type-section__statement t-display">
        {/* Screen readers get one clean sentence; the positioned words are visual only. */}
        <span className="visually-hidden">
          {srPrefix ? `${srPrefix}: ` : ''}
          {words.join(' ')}
        </span>
        <span aria-hidden="true">
          <span className="type-section__word type-section__word--tl">{first}</span>
          <span className="type-section__word type-section__word--mr">{middle}</span>
          <span className="type-section__word type-section__word--bl">{last}</span>
        </span>
      </Heading>
      {caption && <p className="type-section__caption t-caption">{caption}</p>}
    </div>
  )
}
