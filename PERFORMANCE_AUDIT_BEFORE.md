# PERFORMANCE_AUDIT_BEFORE.md

Date: 2026-06-09
Repo: marketer-portfolio (commit `bf71f43`)

## 1. Dung lượng dự án

| Folder | Size | Notes |
|---|---|---|
| `node_modules/` | ~700 MB | 341 packages, regenerates from `package.json` |
| `.next/` | ~700 MB | dev + production build cache (regenerates) |
| `public/` | **99 MB** | tài nguyên thực tế (ảnh + nhạc + CV) |
| `src/` | ~480 KB | source code |
| `_backup_before_performance_optimize/` | ~600 KB | sao lưu trước tối ưu (vừa tạo) |
| **Tổng working dir** | ~1.5 GB | nhưng chỉ `src/` + `public/` được commit, repo trên GitHub ~104 MB |

### Top 20 file lớn nhất

| File | Size |
|---|---|
| `public/experience/travel/tientram.jpg` | 9.2 MB |
| `public/experience/travel/event-3.jpg` | 9.2 MB |
| `public/experience/travel/event-1.jpg` | 6.2 MB |
| `public/music/portfolio-bgm.mp3` | 4.3 MB |
| `public/experience/margroup/team-content.jpg` | 4.2 MB |
| `public/experience/margroup/team-student-rel.jpg` | 4.1 MB |
| `public/experience/margroup/team-event-setlog-1.jpg` | 4.0 MB |
| `public/experience/travel/hoatnao-1.jpg` | 3.8 MB |
| `public/portrait.png` | 3.3 MB |
| `public/portrait-cutout.png` | 3.3 MB (duplicate?) |
| `public/logo.png` | 1.85 MB |
| ... 13 files ≥ 1 MB | |

### Asset nghi vấn duplicate / không dùng

- `portrait.png` (3.3 MB) — `portrait-cutout.png` cũng 3.3 MB → có thể duplicate, cần verify
- `logo.png` 6250×6250 px (1.85 MB) — quá to cho hiển thị 48×48 px

### Dung lượng `public/experience/` breakdown

| Subfolder | Size |
|---|---|
| `travel/` | 47 MB |
| `margroup/` | 25 MB |
| `sintech/` | 8.7 MB |
| **`experience/` total** | **81 MB (82% của public/)** |

## 2. Dependencies — unused / heavy

### CRITICAL — Dependencies KHÔNG DÙNG nhưng vẫn trong `package.json`

| Package | Lý do unused |
|---|---|
| `three` (^0.184.0) | Chỉ có `src/components/three/hero-scene.tsx`, **chưa từng được import** ở bất kỳ page nào |
| `@react-three/drei` (^10.7.7) | Như trên |
| `@react-three/fiber` (^9.6.1) | Như trên |
| `@react-three/postprocessing` (^3.0.4) | Như trên |
| `@blossom-carousel/core` (^1.1.7) | Chỉ có ambient TS declarations trong `src/types/blossom-modules.d.ts`, không import |
| `@blossom-carousel/web` (^1.1.1) | Như trên |
| `@types/three` (^0.184.1) | Đi kèm `three` |

→ **Bundle hiện tại có thể đang load Three.js** nếu `hero-scene.tsx` được tree-shake không kỹ. Cần verify + remove deps + delete file.

### Dependencies dùng nhưng nặng

| Package | Use case | Notes |
|---|---|---|
| `framer-motion` (^12.40.0) | 44 files import, 31 `useScroll`, 38 `repeat: Infinity` | Core lib, không bỏ được nhưng phải dùng đúng |
| `lenis` (^1.3.23) | Smooth scroll | Đã skip trên mobile, vẫn dùng desktop |
| `react-zoom-pan-pinch` (^4.0.3) | Wheel + pinch zoom modal | OK, lazy-loadable |

## 3. Animation inventory — heaviest hits

### Counters

- **44** components dùng `motion.*`
- **31** `useScroll` / `useMotionValueEvent` subscriptions
- **38** `repeat: Infinity` (animations CHẠY MÃI)
- **58** `whileInView` triggers

### Concrete heavy components

| Component | File | Issue | Severity |
|---|---|---|---|
| Preloader | `site/preloader.tsx` | 80 stars × motion.span × Framer Motion subscription | High (đã có lite-skip) |
| AuroraFlow | `site/aurora-flow.tsx` | 2 huge circles 85vw × 85vw × `blur(140px)` × infinite animate | Critical (đã có lite-skip) |
| SparkleDrift | `site/sparkle-drift.tsx` | 12 sparkles infinite Y+opacity | High (đã có lite-skip) |
| FloatingShapes | `site/floating-shapes.tsx` | 6 dots infinite | Medium (đã có lite-skip) |
| CursorSpotlight | `site/cursor-spotlight.tsx` | `addEventListener('mousemove')` không throttle | High (đã có lite-skip) |
| Cursor | `site/cursor.tsx` | `addEventListener('mousemove')` không throttle | High |
| Hero portrait glow | `sections/hero.tsx` | 3 layer blur-3xl × infinite | Critical (đã có lite-skip) |
| Hero sparkles (6) | `sections/hero.tsx` | 6 infinite Y+scale+opacity | High (đã có lite-skip) |
| Hero useScroll | `sections/hero.tsx` | 5 useTransform on scrollYProgress | Medium |
| LetterReveal | `animations/letter-reveal.tsx` | Per-character useTransform, 20+ subscriptions | Critical (vừa fix mobile) |
| ScrollTextReveal | `animations/scroll-text-reveal.tsx` | Per-word useTransform, 25+ subscriptions | Critical (vừa fix mobile) |
| ParticlesBackground (About) | `sections/about.tsx` line 384 | 30 infinite particles × box-shadow blur | Critical (vừa fix mobile) |
| ImageMarquee | `sections/image-marquee.tsx` | Continuous CSS marquee, không pause off-screen | Medium |
| SkillsMarquee | `sections/skills-marquee.tsx` | Như trên | Medium |
| Tilt | `animations/tilt.tsx` | 11 motion hooks/instance × 20+ instances | High (vừa split shell+core) |
| GlitchText | `animations/glitch-text.tsx` | Infinite filter animation | Medium |
| Work studio | `sections/work.tsx` | Heavy sticky scroll, useScroll x10+, 4 contest panels overlap | Critical |
| Process | `sections/process.tsx` | 34+ motion components, many whileInView | High |
| About | `sections/about.tsx` | 27 motion components, GO BIG panel, story blocks | High (đã giảm) |
| AnimatedEyebrow | `animations/animated-eyebrow.tsx` | Infinite pulse | Low (đã tighten margin) |
| Audio synth | `lib/sound/provider.tsx` | 3 setInterval loops + Web Audio nodes | Medium (only if music enabled) |

### Event listeners

- **mousemove** không throttle: `cursor.tsx`, `cursor-spotlight.tsx` — cập nhật style mỗi pixel chuột di chuyển, có thể 100+ event/giây
- **scroll**: 31 `useScroll` hooks trong Framer Motion (mỗi cái subscribe window scroll). Tổng overhead lớn khi user scroll fast

### requestAnimationFrame

- `smooth-scroll-provider.tsx` — Lenis loop (1 RAF, đã skip mobile)
- `typing-text.tsx` — typing RAF (chỉ chạy khi typing chưa xong)
- `page-entrance.tsx` — 1 nhịp `requestAnimationFrame` cho `scrollTo(0,0)`

→ Tổng cộng **1-2 RAF loop concurrent** (acceptable).

### Audio synth

- `lib/sound/provider.tsx` có 3 `setInterval` loops chạy khi music enabled
- Web Audio API nodes: oscillator + filter + gain → CPU light nhưng cumulative
- MP3 fallback ưu tiên hơn (rare hit synth path)

## 4. Page loading / bundle

### `"use client"` audit

Hầu hết section components là client components vì cần Framer Motion + interactivity. **layout.tsx + page.tsx là Server Components** (good).

### Dynamic imports

`grep -rn 'next/dynamic' src` → **0 results**. Tất cả sections + components import tĩnh.

→ **Toàn bộ animation + Three.js stack có thể đang được include trong initial JS bundle**.

### Images không khai báo width/height

`grep -rn '<Image' src` → tất cả Next/Image đều dùng `width`/`height` hoặc `fill`. **OK, không có layout shift từ image**.

### Asset preload

Hero portrait `priority` ✓ (LCP candidate).

## 5. CSS audit — heavy paint

| Style | Where | Notes |
|---|---|---|
| `filter: blur(140px)` | `aurora-flow.tsx` × 2 lớp 85vw | Cực nặng |
| `filter: blur(3xl)` | Hero portrait glow × 3 lớp | Nặng |
| `backdrop-blur-md` | Modals, drawer, sticky CTA | Acceptable |
| `box-shadow [0_0_24px ...]` | DNA chips gradient | Acceptable nhỏ |
| `box-shadow` lớn | About story blocks hover | Acceptable nhỏ |
| `mix-blend-mode: overlay` | Tilt glare | Acceptable, chỉ render khi mouse hover |
| `clip-path` animation | Không tìm thấy | OK |
| `prefers-reduced-motion` | Smooth scroll provider check | Có support nhưng chỉ skip Lenis, KHÔNG skip Framer Motion animations |

## 6. Section-by-section issues

### Hero (`sections/hero.tsx`)
- 6 motion components for typography (DNA chips, identity, tagline)
- 1 portrait wrapper × 3 glow layers × infinite × `blur-3xl`
- 6 sparkles infinite
- 4 useTransform on scrollYProgress (y, opacity, scale, blur)
- Tagline: TypingText with `startDelay={0}` + ghost reservation (good)

### Work (`sections/work.tsx`) — **HEAVIEST SECTION**
- **79 motion** components in file
- Sticky scroll studio mode với `useScroll({target: stickyRef})`
- 4 contest panels render concurrently, opacity-driven crossfade
- `useTransform` cho mỗi: c1Opacity, c2Opacity, c3Opacity, c4Opacity, c1Y, c2Y, c3Y, c4Y, c1ImgScale, c2ImgScale, c3ImgScale, c4ImgScale, c1Pointer, c2Pointer, c3Pointer, c4Pointer = **16+ useTransform** trên cùng scrollYProgress
- BigContestStage wrapped in Tilt
- Studio dim opacity, intro panel opacity all driven by scroll
- Mobile: 4 contest panels stacked but still has many motion hooks

### Process (`sections/process.tsx`)
- 34 motion components
- 3 org sections (Travel, Margroup, Sintech), each with hero image + programs grid + gallery
- Sintech has 6 task accordions, each with motion.section + imageGrid
- Many `Tilt` wrappers (already split shell+core)
- Many `whileInView` triggers

### About (`sections/about.tsx`)
- 27 motion components
- LetterReveal headline (vừa fix mobile-skip)
- ScrollTextReveal bio (vừa fix mobile-skip)
- 2 StoryBlocks
- GO BIG / OR / GO HOME panel với ParticlesBackground 30 particles (vừa fix mobile-skip)
- Pledge closer signature

### Contact (`sections/contact.tsx`)
- 3+ infinite pulse animations on phone icon
- Magnetic CTA wrappers
- Info cards với Tilt

### Services (`sections/services.tsx`)
- Tab switch animations
- Skill cards với Tilt
- Glitch text title

## 7. Nguyên nhân tổng hợp gây tụt FPS

### Root causes — ranked

1. **Bundle bloat** — Three.js (~500-700KB gzip) đang trong deps nhưng không dùng → load + parse JS trên máy yếu rất nặng
2. **Per-character scroll animations** (LetterReveal/ScrollTextReveal) — 70+ scroll subscriptions concurrent on About entry
3. **Infinite filter:blur animations** (Aurora, Hero glow, sparkles) — GPU composite hit
4. **Mousemove listeners not throttled** (cursor.tsx, cursor-spotlight.tsx) — 100+ event/s × style update
5. **Audio MP3 4.3MB** — đã đổi preload='metadata' nhưng vẫn có hit khi click music
6. **Logo PNG 1.85MB** — quá to, browser cache OK nhưng first hit chậm
7. **Lack of dynamic imports** — toàn bộ section code trong initial bundle
8. **Many concurrent useScroll** — trong Work section, 16+ useTransform on same scrollYProgress

### What's already partially fixed (previous commits)

- `useLowEndDevice` hook trips on cores ≤4, RAM ≤4, save-data, reduced-motion
- Preloader / Atmospheric layers / Hero portrait glow skip on low-end
- LetterReveal, ScrollTextReveal, ParticlesBackground skip on mobile + low-end
- Tilt split shell+core (touch skip core)
- Lenis skip on mobile
- Tagline typing skip on mobile
- Audio preload `metadata` not `auto`
- Preloader 200 → 80 desktop / 40 mobile stars
- Page entrance simplified to opacity-only
- AnimatedEyebrow + StoryBlock viewport margin 0px

### What still needs fixing

- [x] Remove unused Three.js + Blossom dependencies (~~1.5GB~~)
- [ ] Cursor + CursorSpotlight mousemove throttle
- [ ] Image marquee + Skills marquee — pause off-screen
- [ ] Work section sticky studio — heavy on mobile even with current fixes
- [ ] Glitch text — infinite filter animation, throttle
- [ ] Dynamic import for below-fold sections (Work, Process, Services, Contact)
- [ ] Centralize animation profile system (currently scattered `useLowEndDevice` + ad-hoc mobile checks)
- [ ] Centralize `usePageVisibility` hook to pause animations on hidden tabs
- [ ] Audit/replace `filter: blur(140px)` (huge composite layer)

## 8. Đo trong production mode — pending

- [ ] `npm run build` succeeds (history says yes)
- [ ] Production server test on 1366×768 / mobile / tablet
- [ ] CPU 4× slowdown test
- [ ] Console warnings check
- [ ] Fast scroll head-to-tail check

## 9. Notes về backup

- Folder `_backup_before_performance_optimize/` chứa snapshot toàn bộ files quan trọng trước khi phase tối ưu này bắt đầu (commit `bf71f43`)
- Có thể `git stash` + restore từ backup nếu rollback cần
- Sẽ KHÔNG delete folder backup trong process này
