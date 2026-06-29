import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {UserIcon} from '@sanity/icons'
import {schemaTypes} from './schemaTypes'
import {WhoAmI} from './tools/WhoAmI'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET
const title = process.env.SANITY_STUDIO_TITLE || 'Sanity Studio'

if (!projectId || !dataset) {
  throw new Error(
    'Missing SANITY_STUDIO_PROJECT_ID or SANITY_STUDIO_DATASET. Copy .env.example to .env and fill them in.',
  )
}

export default defineConfig({
  name: 'default',
  title,

  projectId,
  dataset,

  plugins: [structureTool(), visionTool()],

  tools: (prev) => [
    ...prev,
    {
      name: 'whoami',
      title: '내 계정 ID',
      icon: UserIcon,
      component: WhoAmI,
    },
  ],

  schema: {
    types: schemaTypes,
  },
})
