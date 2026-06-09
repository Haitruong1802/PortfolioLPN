# PERFORMANCE_AUDIT_AFTER.md

Date: 2026-06-09
Repo: marketer-portfolio
Audit context: máy văn phòng + iPhone 14 Pro Max báo cuộn vào section "Giới thiệu" bị treo / pop-in nguyên khối.

## 1. Nguyên nhân gốc đã tìm ra

### CRITICAL — Bundle bloat từ dep không dùng
Three.js + `@react-three/{fiber,drei,postprocessing}` + `@blossom-carousel/{core,web}` đều có trong `package.json` nhưng **0 import** trong code dùng cho landing page. File `src/components/three/hero-scene.tsx` từng được tạo nhưng không bao giờ được render. Bundle parser phải tải + parse cả đống code này → trên máy văn phòng đây là phần "trắng màn hình ban đầu".

### CRITICAL — Per-character/per-word scroll subscriptions
`LetterReveal` + `ScrollTextReveal` ở About section: 1 motion.span + 1 useTransform / scrollYProgress cho MỖI ký tự / MỖI từ. Tổng cộng 70+ scroll subscriptions cùng fire khi user cuộn vào About. Đây là root cause của "freeze rồi pop full".

### CRITICAL — 30-particle infinite background trong About
`ParticlesBackground` trong panel GO BIG: 30 particles × {y, opacity, scale} infinite × box-shadow blur. GPU phải composite 30 layer riêng kể cả khi tab đang ở section khác.

### HIGH — Mousemove listener không throttle
`cursor.tsx` + `cursor-spotlight.tsx` đều `addEventListener("mousemove", ...)` không qua rAF throttle. Pointer hiện đại 240Hz → up to 240 style updates/giây trên các motion values. Cộng với scroll event đồng thời → main thread overload.

### HIGH — Hero portrait glow stack vô tận
3 `motion.div` × `blur-3xl` (~32px blur) × infinite animation, vẽ trên 32-60 rem viewport area. Compositor layer cost rất cao.

### HIGH — Marquees không pause off-screen
`ImageMarquee` (Hero ngay dưới) và `SkillsMarquee` (giữa Services + Work) đều `animation: ... infinite` CSS + `will-change: transform`. Khi section ra khỏi viewport, animation vẫn chạy + GPU layer vẫn alive. Trên trang dài 10 section, đó là 4 luồng animation song song không bao giờ ngắt.

### MEDIUM — Initial bundle chứa toàn bộ section
Page.tsx import tĩnh Hero / About / Process / Services / Work / Contact / SkillsMarquee / SmoothSectionReveal. Tất cả ~80+ motion components phải parse + hydrate ngay phút đầu. Trên máy yếu, hydrate này có thể mất 1-2 giây.

### MEDIUM — Logic "lite mode" rải rác
`useLowEndDevice` hook chỉ trả `boolean`. Mỗi component check theo cách khác nhau (mobile, low-end, hoặc cả hai). Khó maintain + không có "balanced" tier ở giữa.

### MEDIUM — `will-change: transform` global trên marquee
`image-marquee.module.css` đặt `will-change: transform` chung cho `.track` + `.trackReverse`. Layer compositor giữ alive cả khi pause hoặc off-screen.

### LOW — Audio MP3 4.3 MB preload
Đã sửa từ commit trước (`preload="auto"` → `preload="metadata"`).

## 2. File đã sửa

### Mới tạo

| File | Mục đích |
|---|---|
| `src/lib/hooks/use-animation-profile.ts` | Hook chính: trả 1 trong 3 profile `full` / `balanced` / `lite` |
| `src/lib/hooks/use-page-visibility.ts` | Pause animation khi tab bị ẩn |
| `src/lib/hooks/use-in-viewport.ts` | IntersectionObserver wrapper để pause marquee off-screen |
| `src/lib/hooks/use-raf-throttle.ts` | rAF throttle cho mousemove + scroll callback |
| `src/components/site/atmospheric-layers.tsx` (refactor) | Gate cho 4 layer ambient theo profile |
| `PERFORMANCE_AUDIT_BEFORE.md` | Audit ban đầu |
| `PERFORMANCE_AUDIT_AFTER.md` | File này |
| `PROJECT_SIZE_REPORT.md` | Báo cáo dung lượng |

### Sửa

| File | Thay đổi chính |
|---|---|
| `package.json` | Gỡ 7 deps unused (three + react-three + blossom + types/three) |
| `src/app/page.tsx` | Dynamic import 6 section dưới fold (About/Process/Services/Work/Contact/SkillsMarquee/SmoothSectionReveal) |
| `src/components/sections/hero.tsx` | Profile-aware portrait glow: full=3 layer animated + 6 sparkle, balanced=1 layer tĩnh + 3 sparkle, lite=không có |
| `src/components/sections/image-marquee.tsx` | useInViewport + usePageVisibility → pause khi off-screen / tab hidden |
| `src/components/sections/image-marquee.module.css` | `will-change: transform` chỉ khi đang animate (đặt cùng animation), drop về `auto` khi `.paused` |
| `src/components/sections/skills-marquee.tsx` | Như ImageMarquee |
| `src/components/site/cursor.tsx` | Chỉ render khi profile === "full" (skip balanced/lite); mousemove qua useRafThrottle |
| `src/components/site/cursor-spotlight.tsx` | mousemove qua useRafThrottle (render gate đã ở AtmosphericLayers) |
| `src/components/site/atmospheric-layers.tsx` | Profile-aware: full=4 layer, balanced=2 layer (drop Aurora + Spotlight), lite=0 |
| `src/components/site/aurora-flow.tsx` | `blur(140px)` → `blur(100px)`, `blur(160px)` → `blur(120px)` (giảm composite cost) |
| `src/lib/hooks/use-low-end-device.ts` | Delegate sang `useAnimationProfile()` |
| `.gitignore` | Thêm `_backup_before_performance_optimize/` |

### Xoá

| File | Lý do |
|---|---|
| `src/components/three/hero-scene.tsx` | Không bao giờ được import |
| `src/components/three/` (folder rỗng) | Hệ quả |
| `src/types/blossom-jsx.d.ts` | Type declarations cho dep đã gỡ |
| `src/types/blossom-modules.d.ts` | Như trên |

### Đã làm trong session trước (vẫn giữ)

- `useLowEndDevice` (giờ delegate `useAnimationProfile`)
- Preloader skip + giảm stars (200 → 80/40)
- AtmosphericLayers gate
- Hero portrait glow conditional
- LetterReveal + ScrollTextReveal + ParticlesBackground mobile fast-path
- Tilt shell+core split (touch skip core)
- Tagline typing skip on mobile
- Lenis skip on mobile
- Audio preload metadata
- Error boundary `src/app/error.tsx`
- Section reorder + naming/i18n fixes

## 3. Animation system 3-profile

```
                full              balanced           lite
─────────────────────────────────────────────────────────────────────
Preloader        ✓ 80 stars 3.2s   ✓ 80 stars 3.2s    ✗ skip
AtmosphericFlow  ✓ all 4 layers    ✓ Floating + Spark ✗ none
   AuroraFlow    ✓                 ✗                  ✗
   Sparkle       ✓                 ✓                  ✗
   Floating      ✓                 ✓                  ✗
   CursorSpot    ✓                 ✗                  ✗
Hero portrait    ✓ 3 anim glow     ✓ 1 static halo    ✗ none
Hero sparkles    ✓ 6 infinite      ✓ 3 infinite       ✗ none
Custom cursor    ✓                 ✗                  ✗
LetterReveal     ✓ per-char        ✓ single fade*     ✓ single fade*
ScrollTextReveal ✓ per-word        ✓ single fade*     ✓ single fade*
ParticlesBg      ✓ 30 anim         ✗ none*            ✗ none*
TypingText       ✓ rAF char-by     ✗ instant text*    ✗ instant text*
Tilt (3D card)   ✓ on mouse        ✗ on touch         ✗ skip core
Marquees         pause off-screen + tab hidden across all profiles
Lenis scroll     ✓ desktop         ✗ mobile           (n/a)
```

\* simplify=mobile OR lite (chứ không phải balanced) trên các hook hiện tại; mobile thường rơi vào balanced profile.

## 4. Dung lượng

```
                 BEFORE        AFTER         Diff
──────────────────────────────────────────────────────
Working dir      ~1.5 GB       ~602 MB       −900 MB
node_modules      ~700 MB      489 MB         −211 MB
.next cache       ~700 MB       13 MB         −687 MB (rebuild fresh)
public           99 MB         99 MB           0 (chưa nén ảnh)
src              0.5 MB        0.5 MB          0
GitHub repo      ~104 MB       ~104 MB         0
```

## 5. Bundle ước tính

Trước: bundle chứa `three.js` runtime (~580 KB gzip) + tất cả section import tĩnh.
Sau: bundle initial chỉ chứa Hero + ImageMarquee + Footer + CurvedDivider + framework. Các section khác lazy-load qua `next/dynamic`.

Em không đo chính xác `kB First Load JS` vì `next build` ở môi trường này không in column đó ra trong output mặc định. Sau khi deploy Vercel anh có thể vào Deployment → Analytics → Bundle để xem số chính xác.

## 6. Kết quả check

| Check | Status | Notes |
|---|---|---|
| TypeScript (`npx tsc --noEmit`) | (build pass implies OK) | `Finished TypeScript in 4.4s` trong build output |
| Production build (`npx next build`) | ✓ PASS | 10/10 static pages generated, 4 dynamic routes |
| Lint (`npx eslint src`) | ⚠ 25+ pre-existing warnings | Chủ yếu `react-hooks/set-state-in-effect` từ rule mới của `eslint-config-next 16` — đã tồn tại từ trước (theme provider, sound provider, several sections), không phải regression của session này. Em fix các errors mới phát sinh trong file em viết. |
| Backup folder tạo | ✓ | `_backup_before_performance_optimize/` chứa snapshot |
| `.gitignore` updated | ✓ | Backup folder ignored |

## 7. Hạng mục KHÔNG đo được trong môi trường hiện tại

- **Chrome DevTools CPU 4× throttle test** — em không có browser headless để chạy
- **Lighthouse Performance score** — cần production server đang chạy + Chromium browser
- **Bundle size analysis chính xác** — cần thêm `@next/bundle-analyzer` (em không thêm vì chưa được anh approve)
- **FPS sampling runtime** — chỉ test được trên thiết bị thật

→ Em recommend anh deploy lên Vercel (auto re-deploy khi push), rồi chạy Lighthouse từ Chrome → Performance tab trên https://portfolio-lpn.vercel.app/

## 8. Checklist test thủ công cho anh

### Trên iPhone 14 Pro Max (cảm giác lag trước đó)
- [ ] Vào trang → preloader chạy mượt, không khựng
- [ ] Cuộn xuống Giới thiệu (About) → **KHÔNG còn pop nguyên khối**, từng phần fade-in dần
- [ ] Cuộn ngược lên/xuống nhiều lần → 60 FPS suốt
- [ ] Bật music → MP3 phát đúng (không synth)
- [ ] Toggle theme light/dark → switch mượt
- [ ] Toggle VI/EN → text đổi đúng

### Trên máy văn phòng yếu (4 cores / 4 GB RAM)
- [ ] Preloader **skip** entirely (vào page ngay) — vì hit lite profile
- [ ] **Không thấy** aurora background, sparkles, cursor spotlight, custom cursor
- [ ] Hero portrait **không có glow xung quanh**
- [ ] Tagline "Cùng khám phá..." hiện full text instant (không typing)
- [ ] Cuộn toàn trang smooth, không lag

### Trên laptop tầm trung
- [ ] Preloader chạy đầy đủ
- [ ] Hero portrait có **1 halo tĩnh** + 3 sparkle (giảm so với full)
- [ ] Aurora bg ẨN; Floating dots + Sparkle giữ
- [ ] **Cursor custom + spotlight ẨN** (vì balanced)
- [ ] Marquee chạy nhưng pause khi cuộn ra khỏi
- [ ] Open music → MP3 phát

### Trên desktop strong (8+ cores, mouse fine)
- [ ] Toàn bộ cinematic effects bật
- [ ] Cursor custom theo chuột
- [ ] Hero glow 3 lớp + 6 sparkle animate
- [ ] Aurora background trôi
- [ ] Tilt 3D card hover mượt
- [ ] Lenis smooth scroll bật

### Edge cases
- [ ] **Settings → Reduce Motion** (iOS hoặc OS) → hit lite profile, tất cả cinematic ẨN, page hoạt động bình thường
- [ ] **Data Saver** (Chrome → Settings → Performance) → hit lite profile
- [ ] **Tab background** → animations tự pause (browser throttle + usePageVisibility cho marquees)
- [ ] **Resize browser** → layout responsive OK, profile có thể đổi (balanced ↔ full) khi pass breakpoint

### Việc anh có thể tự làm thêm

1. **Nén ảnh travel/margroup ≥4 MB** qua https://squoosh.app/ — giảm public/ size từ 99MB xuống ~30MB
2. **Resize logo.png 6250×6250 → 256×256** qua Photoshop / Squoosh — giảm 1.85MB → ~30KB
3. **Update `metadataBase` trong `layout.tsx`** sau khi deploy Vercel để OG image preview hoạt động
4. **Test Lighthouse Performance** trên https://pagespeed.web.dev/ với URL Vercel đã deploy

## 9. Recommend tiếp theo

Nếu sau khi test anh vẫn thấy section nào lag:
- Em cần thêm 1 vòng audit cho `process.tsx` (34 motion components) và `work.tsx` (79 motion components, sticky studio)
- Hai section đó hiện đã dynamic-import nên không ảnh hưởng initial load, nhưng khi user cuộn vào sẽ có hit
- Việc tối ưu thêm cho Work studio (16 useTransform trên cùng scrollYProgress) là task tiếp theo lớn nhất

Báo em chỗ nào vẫn lag em sẽ xử tiếp.
