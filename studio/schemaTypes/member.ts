import {defineField, defineType} from 'sanity'

export const member = defineType({
  name: 'member',
  title: '멤버',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: '이름',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: '슬러그',
      type: 'slug',
      description: '고유 키 (예: seokhyun)',
      options: {source: 'name', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'bio',
      title: '소개',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'image',
      title: '사진',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'favoriteCategories',
      title: '선호 카테고리',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'category'}]}],
    }),
    defineField({
      name: 'userId',
      title: 'Sanity 계정 ID',
      type: 'string',
      description:
        '이 멤버로 글을 쓸 Sanity 로그인 계정의 ID. 좌측 상단 메뉴의 "내 계정 ID" 도구에서 확인해 입력하면, 그 계정으로 새 글을 만들 때 작성자가 이 멤버로 자동 지정됩니다.',
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'bio', media: 'image'},
  },
})
