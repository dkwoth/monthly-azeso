# monthly-azeso

맛집 탐방 소모임 **AZESO**의 방문 기록 블로그.

- **프론트엔드**: Next.js (App Router) + Tailwind, 정적 export(`output: 'export'`) → Cloudflare Pages
- **CMS**: Sanity (헤드리스). 콘텐츠는 빌드 시점에 가져와 정적 페이지로 렌더링
- **편집기**: Sanity Studio (`*.sanity.studio`)

## 구조 (sibling 모노레포)

```
monthly-azeso/
├─ site/     # Next.js 프론트엔드 (Cloudflare Pages 루트)
└─ studio/   # Sanity Studio (콘텐츠 편집기 + 스키마)
```

## 환경변수

프로젝트별 설정(projectId, dataset 등)은 레포에 커밋하지 않고 `.env`에서 로드합니다. 각 디렉터리의 `.env.example`을 복사해 채우세요.

- `site/.env.local` ← `site/.env.example` (`NEXT_PUBLIC_SANITY_*`)
- `studio/.env` ← `studio/.env.example` (`SANITY_STUDIO_*`)

CI/호스팅에서는 같은 값을 각 플랫폼의 환경변수(GitHub Actions Variables, Cloudflare Pages 환경변수)로 넣습니다.

## 로컬 개발

```bash
# 프론트엔드  → http://localhost:3000
cd site && npm install && npm run dev

# Studio(편집기) → http://localhost:3333
cd studio && npm install && npm run dev
```

> dev 서버는 매 요청마다 Sanity에서 데이터를 새로 가져오므로, Studio 편집이 즉시 반영됩니다. (프로덕션은 정적이라 재빌드가 필요 — 아래 참고)

## 배포

세 가지가 **독립적으로** 배포됩니다.

### 1. 콘텐츠(글) — 배포 불필요

Studio에서 저장/발행하면 Sanity 클라우드에 즉시 반영됩니다. 별도 배포 작업이 없습니다. (단, 정적 프론트엔드에 보이게 하려면 아래 재빌드가 필요)

### 2. 프론트엔드(블로그) — Cloudflare Pages (정적)

- **Cloudflare Pages 설정**: 루트 디렉터리 `site`, 빌드 명령 `npm run build`, **출력 디렉터리 `out`**
- **환경변수**: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`
- 정적 사이트라 **글을 고쳐도 재빌드 전엔 반영되지 않습니다.** 자동 반영하려면:
  - Cloudflare Pages에서 **Deploy Hook URL** 생성
  - Sanity `manage` → API → Webhooks 에 등록 → 글 발행 시 자동 재빌드

### 3. Studio(편집기) — 수동 배포

스키마·도구 등 **Studio 코드를 바꿨을 때만** 재배포가 필요합니다(콘텐츠 편집과 무관). 자주 바뀌지 않으므로 자동화 없이 수동으로 합니다:

```bash
cd studio
npm run deploy        # = sanity deploy
```

- 최초 1회는 **호스트네임**을 물어봅니다(예: `monthly-azeso` → `https://monthly-azeso.sanity.studio`). 이후 같은 명령으로 갱신하며, 호스트네임은 자동 기억됩니다.
- 로그인된 Sanity 세션을 사용합니다(`npx sanity login`).
- `autoUpdates: true`는 Sanity 프레임워크만 자동 갱신하며, 우리가 만든 스키마/도구 변경은 위 `npm run deploy`로 반영해야 합니다.
