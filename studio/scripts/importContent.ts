/**
 * 기존 Astro 콘텐츠(../site)를 Sanity로 가져오는 1회성 마이그레이션 스크립트.
 *
 * 실행 (studio/ 디렉터리에서):
 *   npx sanity exec scripts/importContent.ts --with-user-token
 *
 * --with-user-token 으로 로그인된 사용자 세션의 쓰기 권한을 사용합니다.
 * createOrReplace + 결정적 _id 라서 여러 번 실행해도 안전(멱등)합니다.
 * 이미지는 내용 해시로 중복 제거되어 재업로드되지 않습니다.
 */
import {getCliClient} from 'sanity/cli'
import {readFileSync, readdirSync, createReadStream, existsSync} from 'node:fs'
import {basename, join, resolve} from 'node:path'
import matter from 'gray-matter'
import {load as yamlLoad} from 'js-yaml'

const client = getCliClient({apiVersion: '2024-01-01'})

// studio/ 기준으로 ../site 를 가리킴
const SITE = resolve(process.cwd(), '..', 'site')
const CONTENT = join(SITE, 'src', 'content')
const PUBLIC = join(SITE, 'public')

let keyCounter = 0
const key = () => `k${(keyCounter++).toString(36)}${Math.random().toString(36).slice(2, 6)}`

const catId = (slug: string) => `category-${slug}`
const memberId = (slug: string) => `member-${slug}`
const postId = (slug: string) => `post-${slug}`

const slugField = (current: string) => ({_type: 'slug', current})
const ref = (id: string) => ({_type: 'reference', _ref: id, _key: key()})

// ---- 이미지 업로드 (해시 기반 캐시) ----
const assetCache = new Map<string, string>()
async function uploadImage(publicPath: string): Promise<string> {
  // publicPath 예: "/images/posts/2026-02-black-goat.jpg"
  if (assetCache.has(publicPath)) return assetCache.get(publicPath)!
  const filePath = join(PUBLIC, publicPath)
  if (!existsSync(filePath)) {
    throw new Error(`이미지 없음: ${filePath}`)
  }
  const asset = await client.assets.upload('image', createReadStream(filePath), {
    filename: basename(filePath),
  })
  assetCache.set(publicPath, asset._id)
  return asset._id
}

async function imageField(publicPath: string) {
  const assetRef = await uploadImage(publicPath)
  return {_type: 'image', asset: {_type: 'reference', _ref: assetRef}}
}

// ---- 마크다운 → Portable Text ----
type Span = {_type: 'span'; _key: string; text: string; marks: string[]}
type Block = {
  _type: 'block'
  _key: string
  style: string
  markDefs: {_type: 'link'; _key: string; href: string}[]
  children: Span[]
}

function parseInline(text: string): {children: Span[]; markDefs: Block['markDefs']} {
  const children: Span[] = []
  const markDefs: Block['markDefs'] = []
  // [text](url) 와 **bold** 를 토큰화
  const regex = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g
  let last = 0
  let m: RegExpExecArray | null
  const push = (t: string, marks: string[]) => {
    if (t) children.push({_type: 'span', _key: key(), text: t, marks})
  }
  while ((m = regex.exec(text)) !== null) {
    push(text.slice(last, m.index), [])
    if (m[1] !== undefined) {
      // 링크
      const def = {_type: 'link' as const, _key: key(), href: m[2]}
      markDefs.push(def)
      push(m[1], [def._key])
    } else if (m[3] !== undefined) {
      // 굵게
      push(m[3], ['strong'])
    }
    last = regex.lastIndex
  }
  push(text.slice(last), [])
  if (children.length === 0) push('', [])
  return {children, markDefs}
}

function block(style: string, text: string): Block {
  const {children, markDefs} = parseInline(text)
  return {_type: 'block', _key: key(), style, markDefs, children}
}

function markdownToBlocks(md: string): Block[] {
  const lines = md.replace(/\r\n/g, '\n').split('\n')
  const blocks: Block[] = []
  let para: string[] = []
  const flush = () => {
    if (para.length) {
      blocks.push(block('normal', para.join(' ').trim()))
      para = []
    }
  }
  for (const raw of lines) {
    const line = raw.trimEnd()
    if (line.trim() === '') {
      flush()
    } else if (line.startsWith('### ')) {
      flush()
      blocks.push(block('h3', line.slice(4).trim()))
    } else if (line.startsWith('## ')) {
      flush()
      blocks.push(block('h2', line.slice(3).trim()))
    } else if (line.startsWith('# ')) {
      flush()
      blocks.push(block('h2', line.slice(2).trim()))
    } else if (line.startsWith('> ')) {
      flush()
      blocks.push(block('blockquote', line.slice(2).trim()))
    } else {
      para.push(line.trim())
    }
  }
  flush()
  return blocks
}

// ---- YAML 로더 ----
function readYaml<T>(file: string): T {
  return yamlLoad(readFileSync(file, 'utf8')) as T
}

function listFiles(dir: string, ext: string): string[] {
  return readdirSync(dir)
    .filter((f) => f.endsWith(ext))
    .map((f) => join(dir, f))
}

const toDateString = (d: unknown): string => {
  if (d instanceof Date) return d.toISOString().slice(0, 10)
  return String(d).slice(0, 10)
}

async function run() {
  const docs: Record<string, unknown>[] = []

  // 1) 카테고리
  for (const file of listFiles(join(CONTENT, 'categories'), '.yaml')) {
    const slug = basename(file, '.yaml')
    const data = readYaml<{label: string; color?: string; description?: string}>(file)
    docs.push({
      _id: catId(slug),
      _type: 'category',
      label: data.label,
      slug: slugField(slug),
      color: data.color,
      description: data.description,
    })
  }

  // 2) 멤버 (이미지 업로드)
  for (const file of listFiles(join(CONTENT, 'members'), '.yaml')) {
    const slug = basename(file, '.yaml')
    const data = readYaml<{
      name: string
      bio?: string
      image?: string
      favoriteCategories?: string[]
    }>(file)
    docs.push({
      _id: memberId(slug),
      _type: 'member',
      name: data.name,
      slug: slugField(slug),
      bio: data.bio,
      image: data.image ? await imageField(data.image) : undefined,
      favoriteCategories: (data.favoriteCategories ?? []).map((c) => ref(catId(c))),
    })
  }

  // 3) 후기 (이미지 업로드 + 본문 변환)
  for (const file of listFiles(join(CONTENT, 'posts'), '.md')) {
    const slug = basename(file, '.md')
    const {data, content} = matter(readFileSync(file, 'utf8'))
    const fm = data as {
      title: string
      date: unknown
      categories: string[]
      location: string
      mapUrl?: string
      rating: number
      members: string[]
      author: string
      image: string
      images?: string[]
      excerpt: string
    }

    const gallery = fm.images?.length
      ? await Promise.all(fm.images.map(async (p) => ({...(await imageField(p)), _key: key()})))
      : undefined

    docs.push({
      _id: postId(slug),
      _type: 'post',
      title: fm.title,
      slug: slugField(slug),
      date: toDateString(fm.date),
      excerpt: fm.excerpt,
      categories: fm.categories.map((c) => ref(catId(c))),
      location: fm.location,
      mapUrl: fm.mapUrl,
      rating: fm.rating,
      members: fm.members.map((mm) => ref(memberId(mm))),
      author: {_type: 'reference', _ref: memberId(fm.author)},
      mainImage: await imageField(fm.image),
      gallery,
      body: markdownToBlocks(content),
    })
  }

  // 업로드: 참조 무결성을 위해 category → member → post 순서로 트랜잭션 처리
  const order = {category: 0, member: 1, post: 2} as Record<string, number>
  docs.sort((a, b) => order[a._type as string] - order[b._type as string])

  const tx = client.transaction()
  for (const doc of docs) {
    // undefined 필드 제거
    const clean = Object.fromEntries(Object.entries(doc).filter(([, v]) => v !== undefined))
    tx.createOrReplace(clean as {_id: string; _type: string})
  }
  await tx.commit()

  const counts = docs.reduce<Record<string, number>>((acc, d) => {
    acc[d._type as string] = (acc[d._type as string] || 0) + 1
    return acc
  }, {})
  console.log('가져오기 완료:', counts)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
