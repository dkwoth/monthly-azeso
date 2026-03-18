import { defineCollection, reference, z } from 'astro:content';

const categories = defineCollection({
  type: 'data',
  schema: z.object({
    label: z.string(),
    color: z.string().optional(),
    description: z.string().optional(),
  }),
});

const members = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    bio: z.string().optional(),
    image: z.string().optional(),
    favoriteCategories: z.array(reference('categories')).optional(),
  }),
});

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    categories: z.array(reference('categories')),
    location: z.string(),
    mapUrl: z.string().url().optional(),
    rating: z.number().min(0).max(3),
    members: z.array(reference('members')),
    author: reference('members'),
    image: z.string(),
    excerpt: z.string(),
  }),
});

export const collections = { categories, members, posts };
