import type { APIRoute } from 'astro';
import { SOJU_GLASS_PATHS } from '../utils/sojuGlass';

export const GET: APIRoute = () => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c0392b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
  <path d="${SOJU_GLASS_PATHS.glass}" fill="#c0392b" />
  <path d="${SOJU_GLASS_PATHS.base}" />
</svg>`;

  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml' },
  });
};
