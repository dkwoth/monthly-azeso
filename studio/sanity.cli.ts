import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET,
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
    // 배포 대상 앱 ID (azeso.sanity.studio) — 지정 시 배포 때 호스트네임/앱 선택을 묻지 않음
    appId: process.env.SANITY_STUDIO_DEPLOY_APP_ID,
  },
})
