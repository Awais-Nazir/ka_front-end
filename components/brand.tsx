import Link from 'next/link'

export function FolioMark({ size = 28 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <path d="M3 8 14 3l4 21-11 5z" fill="currentColor" opacity=".55" />
    <path d="m10 5 11-3 3 23-11 4z" fill="currentColor" opacity=".75" />
    <path d="M18 3h11v25H18z" fill="currentColor" />
  </svg>
}

export function Brand() {
  return <Link href="/" aria-label="Folio home" className="brand"><span><FolioMark /></span>Folio</Link>
}
