import {defineField, defineType} from 'sanity'
import {GalleryCoverInput} from '../components/GalleryCoverInput'

type GalleryImage = {_key: string; asset?: {_ref?: string}}

export const post = defineType({
  name: 'post',
  title: '후기',
  type: 'document',
  // 새 글 생성 시, 로그인한 사용자의 계정 ID와 일치하는 멤버를 작성자로 자동 지정
  initialValue: async (_params, context) => {
    const userId = context.currentUser?.id
    if (!userId) return {}
    const client = context.getClient({apiVersion: '2024-01-01'})
    const member = await client.fetch<{_id: string} | null>(
      `*[_type == "member" && userId == $userId][0]{_id}`,
      {userId},
    )
    return member ? {author: {_type: 'reference', _ref: member._id}} : {}
  },
  fields: [
    defineField({
      name: 'title',
      title: '제목',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: '슬러그',
      type: 'slug',
      description: 'URL 경로 (예: 2026-02-black-goat)',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: '방문 날짜',
      type: 'date',
      options: {dateFormat: 'YYYY-MM-DD'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: '한 줄 요약',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'categories',
      title: '카테고리',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'category'}]}],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'location',
      title: '위치',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mapUrl',
      title: '지도 링크',
      type: 'url',
    }),
    defineField({
      name: 'rating',
      title: '평점 (0–3)',
      type: 'number',
      validation: (rule) => rule.required().min(0).max(3).integer(),
    }),
    defineField({
      name: 'members',
      title: '참여 멤버',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'member'}]}],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'author',
      title: '작성자',
      type: 'reference',
      to: [{type: 'member'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: '이미지 (갤러리)',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
      description: '후기 이미지들. 최소 1개 이상 등록하세요.',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'mainImageKey',
      title: '대표 이미지',
      type: 'string',
      description: '갤러리에서 카드 썸네일로 쓸 대표 이미지를 선택하세요.',
      components: {input: GalleryCoverInput},
      validation: (rule) =>
        rule.required().custom((key, context) => {
          const gallery = (context.document?.gallery as GalleryImage[] | undefined) ?? []
          if (gallery.length === 0) return true // 갤러리 필수 검증에 맡김
          if (!key) return '갤러리에서 대표 이미지를 선택하세요.'
          return gallery.some((img) => img._key === key)
            ? true
            : '선택한 대표 이미지가 갤러리에 없습니다. 다시 선택하세요.'
        }),
    }),
    defineField({
      name: 'body',
      title: '본문',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: '본문', value: 'normal'},
            {title: '제목 2', value: 'h2'},
            {title: '제목 3', value: 'h3'},
            {title: '인용', value: 'blockquote'},
          ],
          lists: [
            {title: '글머리 기호', value: 'bullet'},
            {title: '번호', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: '굵게', value: 'strong'},
              {title: '기울임', value: 'em'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: '링크',
                fields: [{name: 'href', type: 'url', title: 'URL'}],
              },
            ],
          },
        },
      ],
    }),
  ],
  orderings: [
    {
      title: '방문 날짜 (최신순)',
      name: 'dateDesc',
      by: [{field: 'date', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'title', date: 'date', gallery: 'gallery', mainImageKey: 'mainImageKey'},
    prepare({title, date, gallery, mainImageKey}) {
      const images = (gallery as GalleryImage[] | undefined) ?? []
      const cover = images.find((img) => img._key === mainImageKey) ?? images[0]
      return {title, subtitle: date, media: cover as unknown as undefined}
    },
  },
})
