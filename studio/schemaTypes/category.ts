import {defineField, defineType} from 'sanity'

export const category = defineType({
  name: 'category',
  title: '카테고리',
  type: 'document',
  fields: [
    defineField({
      name: 'label',
      title: '이름',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: '슬러그',
      type: 'slug',
      description: '필터/URL에 쓰이는 고유 키 (예: korean)',
      options: {source: 'label', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'color',
      title: '색상',
      type: 'string',
      description: '배지 색상 (#RRGGBB)',
    }),
    defineField({
      name: 'description',
      title: '설명',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'description'},
  },
})
