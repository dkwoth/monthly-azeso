/**
 * 기존 후기 데이터를 새 이미지 모델로 마이그레이션한다.
 *
 *  - gallery 가 비어 있으면 mainImage 를 갤러리 첫 이미지로 옮긴다.
 *  - mainImageKey 를, mainImage 와 같은 에셋을 가리키는 갤러리 항목의 _key 로 설정한다.
 *    (갤러리에 없으면 mainImage 를 갤러리 맨 앞에 추가하고 그 _key 를 쓴다.)
 *  - 더 이상 쓰지 않는 mainImage 필드는 제거한다.
 *
 * 실행:  npx sanity exec scripts/migrateGalleryCover.ts --with-user-token
 * (본인 Sanity CLI 로그인 토큰으로 실행됩니다)
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2024-01-01'})

type ImageRef = {_type: 'image'; _key?: string; asset?: {_ref?: string}; hotspot?: unknown; crop?: unknown}
type Post = {_id: string; title?: string; mainImage?: ImageRef; gallery?: ImageRef[]; mainImageKey?: string}

const randomKey = () => Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6)

async function run() {
  const posts = await client.fetch<Post[]>(
    `*[_type == "post"]{_id, title, mainImage, gallery, mainImageKey}`,
  )

  for (const post of posts) {
    const gallery = (post.gallery ?? []).map((img) => ({...img, _key: img._key || randomKey()}))
    const main = post.mainImage

    let newGallery: ImageRef[] = gallery
    let mainKey: string | undefined

    const matched = main?.asset?._ref
      ? gallery.find((img) => img.asset?._ref === main.asset?._ref)
      : undefined

    if (matched) {
      mainKey = matched._key
    } else if (main?.asset?._ref) {
      // mainImage 를 갤러리 맨 앞에 추가
      const item: ImageRef = {
        _type: 'image',
        _key: randomKey(),
        asset: main.asset,
        ...(main.hotspot ? {hotspot: main.hotspot} : {}),
        ...(main.crop ? {crop: main.crop} : {}),
      }
      newGallery = [item, ...gallery]
      mainKey = item._key
    } else if (gallery.length > 0) {
      mainKey = gallery[0]._key
    }

    if (!mainKey) {
      console.warn(`⚠️  건너뜀(이미지 없음): ${post.title ?? post._id}`)
      continue
    }

    await client
      .patch(post._id)
      .set({gallery: newGallery, mainImageKey: mainKey})
      .unset(['mainImage'])
      .commit()

    console.log(
      `✅ ${post.title ?? post._id} — gallery ${newGallery.length}장, 대표=${mainKey}`,
    )
  }

  console.log('완료.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
