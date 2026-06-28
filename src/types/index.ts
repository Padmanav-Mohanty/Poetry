export interface Poem {
  id: string
  title: string
  author: string
  slug: string
  form: string
  language: string
  description: string
  coverColor: [string, string, string]
  readers: number
  lines: number
  uploadedAt: string
  content: string
  featured?: boolean
}

export interface PoetryForm {
  name: string
  icon: string
  count: number
}
