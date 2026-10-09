import { SampleImage } from '../types';

// Clean, high-contrast SVG representations of classic drawing subjects
// These convert directly to PNG/JPEG data URLs for Gemini multimodal analysis

function svgToDataUrl(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

const appleSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <rect width="100%" height="100%" fill="#fbfbfb"/>
  <!-- Cast shadow -->
  <ellipse cx="200" cy="340" rx="90" ry="18" fill="#e5e5e5" opacity="0.8"/>
  <!-- Apple Body -->
  <path d="M 200 130 C 150 110, 110 160, 110 230 C 110 300, 160 340, 200 325 C 240 340, 290 300, 290 230 C 290 160, 250 110, 200 130 Z" fill="#b91c1c" stroke="#1f2937" stroke-width="3"/>
  <!-- Highlight -->
  <path d="M 140 170 C 130 190, 130 220, 145 240" stroke="#fca5a5" stroke-width="12" stroke-linecap="round" fill="none" opacity="0.6"/>
  <!-- Indentation -->
  <path d="M 185 130 C 200 145, 200 145, 215 130" stroke="#7f1d1d" stroke-width="4" stroke-linecap="round" fill="none"/>
  <!-- Stem -->
  <path d="M 200 135 C 198 100, 220 70, 230 60" stroke="#451a03" stroke-width="6" stroke-linecap="round" fill="none"/>
  <!-- Leaf -->
  <path d="M 215 95 C 250 70, 270 95, 275 105 C 255 120, 225 110, 215 95 Z" fill="#15803d" stroke="#1f2937" stroke-width="2"/>
</svg>`;

const mugSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <rect width="100%" height="100%" fill="#fbfbfb"/>
  <!-- Cast shadow -->
  <ellipse cx="190" cy="345" rx="100" ry="20" fill="#e5e5e5" opacity="0.8"/>
  <!-- Handle -->
  <path d="M 270 170 C 350 170, 350 290, 260 290" stroke="#1e293b" stroke-width="18" stroke-linecap="round" fill="none"/>
  <path d="M 270 170 C 330 170, 330 290, 260 290" stroke="#f1f5f9" stroke-width="10" stroke-linecap="round" fill="none"/>
  <!-- Body -->
  <path d="M 120 140 L 130 310 C 130 335, 270 335, 270 310 L 280 140 Z" fill="#334155" stroke="#0f172a" stroke-width="3"/>
  <!-- Shading gradient on cylinder -->
  <path d="M 120 140 L 130 310 C 160 325, 200 325, 220 310 L 210 140 Z" fill="#1e293b" opacity="0.4"/>
  <!-- Inner rim opening -->
  <ellipse cx="200" cy="140" rx="80" ry="24" fill="#0f172a" stroke="#0f172a" stroke-width="3"/>
  <ellipse cx="200" cy="142" rx="76" ry="21" fill="#475569"/>
  <!-- Coffee surface -->
  <ellipse cx="200" cy="155" rx="70" ry="18" fill="#1c1917"/>
</svg>`;

const origamiBirdSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <rect width="100%" height="100%" fill="#fbfbfb"/>
  <!-- Cast shadow -->
  <ellipse cx="200" cy="350" rx="85" ry="16" fill="#e5e5e5"/>
  <!-- Left wing plane -->
  <polygon points="200,160 70,80 160,250" fill="#cbd5e1" stroke="#0f172a" stroke-width="2"/>
  <!-- Right wing plane -->
  <polygon points="200,160 330,70 230,240" fill="#94a3b8" stroke="#0f172a" stroke-width="2"/>
  <!-- Body core -->
  <polygon points="200,160 160,250 200,310 230,240" fill="#e2e8f0" stroke="#0f172a" stroke-width="2"/>
  <!-- Neck and head -->
  <polygon points="160,250 140,290 120,230" fill="#94a3b8" stroke="#0f172a" stroke-width="2"/>
  <polygon points="120,230 85,240 115,250" fill="#475569" stroke="#0f172a" stroke-width="2"/>
  <!-- Tail -->
  <polygon points="200,310 250,335 230,240" fill="#64748b" stroke="#0f172a" stroke-width="2"/>
</svg>`;

const monsteraLeafSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <rect width="100%" height="100%" fill="#fbfbfb"/>
  <!-- Cast shadow -->
  <ellipse cx="200" cy="360" rx="90" ry="14" fill="#e5e5e5"/>
  <!-- Stem -->
  <path d="M 200 360 C 200 300, 195 240, 190 100" stroke="#15803d" stroke-width="6" fill="none"/>
  <!-- Leaf outline with fenestrations -->
  <path d="M 190 100 
           C 140 120, 110 160, 120 200 C 135 195, 155 195, 160 210 C 130 225, 110 250, 130 290 C 150 280, 165 285, 170 300 C 150 320, 175 340, 200 350
           C 225 340, 250 320, 230 300 C 235 285, 250 280, 270 290 C 290 250, 270 225, 240 210 C 245 195, 265 195, 280 200 C 290 160, 260 120, 190 100 Z" 
        fill="#166534" stroke="#064e3b" stroke-width="3"/>
  <!-- Inner holes / fenestrations -->
  <ellipse cx="170" cy="180" rx="6" ry="16" transform="rotate(-25 170 180)" fill="#fbfbfb" stroke="#064e3b" stroke-width="2"/>
  <ellipse cx="230" cy="180" rx="6" ry="16" transform="rotate(25 230 180)" fill="#fbfbfb" stroke="#064e3b" stroke-width="2"/>
  <ellipse cx="165" cy="245" rx="5" ry="14" transform="rotate(-35 165 245)" fill="#fbfbfb" stroke="#064e3b" stroke-width="2"/>
  <ellipse cx="235" cy="245" rx="5" ry="14" transform="rotate(35 235 245)" fill="#fbfbfb" stroke="#064e3b" stroke-width="2"/>
</svg>`;

export const SAMPLE_IMAGES: SampleImage[] = [
  {
    id: 'apple',
    title: 'Red Apple',
    category: 'Sphere & Form',
    thumbnail: svgToDataUrl(appleSvg),
    dataUrl: svgToDataUrl(appleSvg),
    mimeType: 'image/svg+xml',
  },
  {
    id: 'coffee-mug',
    title: 'Ceramic Mug',
    category: 'Cylinder & Ellipse',
    thumbnail: svgToDataUrl(mugSvg),
    dataUrl: svgToDataUrl(mugSvg),
    mimeType: 'image/svg+xml',
  },
  {
    id: 'origami-bird',
    title: 'Origami Bird',
    category: 'Planes & Angles',
    thumbnail: svgToDataUrl(origamiBirdSvg),
    dataUrl: svgToDataUrl(origamiBirdSvg),
    mimeType: 'image/svg+xml',
  },
  {
    id: 'monstera-leaf',
    title: 'Monstera Leaf',
    category: 'Organic Contours',
    thumbnail: svgToDataUrl(monsteraLeafSvg),
    dataUrl: svgToDataUrl(monsteraLeafSvg),
    mimeType: 'image/svg+xml',
  },
];
