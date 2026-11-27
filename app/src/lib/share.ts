/**
 * Share links without a backend: the finished book is compressed into the URL itself
 * (#/read/<data>). Anyone with the link can read it; nothing is stored on a server.
 */
import type { Book } from './types'
import { isPlaceholder } from './text'

const b64url = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
const unb64url = (s: string) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0))

async function pipe(data: Uint8Array, stream: CompressionStream | DecompressionStream) {
  const out = new Response(new Blob([data]).stream().pipeThrough(stream))
  return new Uint8Array(await out.arrayBuffer())
}

export async function encodeBook(book: Book): Promise<string> {
  const slim: Book = {
    ...book,
    cover: { ...book.cover, image: undefined, imageMode: undefined },
    chapters: book.chapters.filter((c) => c.status === 'done').map((c) => ({ ...c, paras: c.paras.filter((p) => !isPlaceholder(p)), versions: [], doneAt: undefined })),
  }
  const raw = new TextEncoder().encode(JSON.stringify(slim))
  return b64url(await pipe(raw, new CompressionStream('deflate-raw')))
}

export async function decodeBook(data: string): Promise<Book> {
  const json = new TextDecoder().decode(await pipe(unb64url(data), new DecompressionStream('deflate-raw')))
  const book = JSON.parse(json) as Book
  if (!book?.title || !Array.isArray(book.chapters)) throw new Error('not a book')
  return book
}

export async function shareUrl(book: Book) {
  return `${location.origin}${import.meta.env.BASE_URL}#/read/${await encodeBook(book)}`
}
