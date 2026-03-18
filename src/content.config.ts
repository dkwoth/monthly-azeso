import { defineCollection, reference, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const categories = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/categories' }),
  schema: z.object({
    label: z.string(),
    color: z.string().optional(),
    description: z.string().optional(),
  }),
});

const members = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/members' }),
  schema: z.object({
    name: z.string(),
    bio: z.string().optional(),
    image: z.string().optional(),
    favoriteCategories: z.array(reference('categories')).optional(),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
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
