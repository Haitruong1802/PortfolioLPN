# PROJECT_SIZE_REPORT.md

Date: 2026-06-09
Repo: marketer-portfolio

## Tổng dung lượng working directory

| Trạng thái | Total | `node_modules/` | `.next/` | `public/` | `src/` |
|---|---|---|---|---|---|
| **Before** | ~1.5 GB | ~700 MB | ~700 MB | 99 MB | 0.5 MB |
| **After cleanup** (xoá `.next`, gỡ deps không dùng, build lại) | ~602 MB | **489 MB** | **13 MB** | 99 MB | 0.5 MB |

→ Tiết kiệm **~900 MB** trên đĩa cục bộ. Repo trên GitHub không đổi (`.next`, `node_modules` luôn `.gitignore`).

## Source thực tế (đi vào git + Vercel)

```
src/             576 KB    (TypeScript + CSS + content data)
public/           99 MB    (ảnh portfolio + nhạc + CV + logo + portrait)
src + public:    ~100 MB   (đúng dung lượng Vercel/GitHub thấy)
```

## node_modules — Before vs After

| | Before | After | Diff |
|---|---|---|---|
| Size | ~700 MB | **489 MB** | **−211 MB** |
| Top-level packages | 341 | 334 | −7 |

### Dependencies đã xoá khỏi `package.json`

Tất cả đều **0 import trong codebase** sau khi audit:

| Package | Lý do | Bundle estimate |
|---|---|---|
| `three` | Chỉ có `src/components/three/hero-scene.tsx` — file CHƯA TỪNG được import ở page nào | ~580 KB gzip |
| `@react-three/fiber` | Như trên | ~90 KB gzip |
| `@react-three/drei` | Như trên | ~120 KB gzip |
| `@react-three/postprocessing` | Như trên | ~80 KB gzip |
| `@blossom-carousel/core` | Chỉ có ambient TS declarations trong `src/types/blossom-modules.d.ts` | ~25 KB gzip |
| `@blossom-carousel/web` | Như trên | ~15 KB gzip |
| `@types/three` | Đi kèm `three` | — |

→ **Bundle JS gửi xuống client tiết kiệm ~900 KB gzip** (nếu tree-shake không kỹ).

### Files đã xoá

| File | Lý do |
|---|---|
| `src/components/three/hero-scene.tsx` | Component chưa từng render, kéo theo cả Three.js stack |
| `src/components/three/` (folder rỗng) | Sau khi xoá hero-scene.tsx |
| `src/types/blossom-jsx.d.ts` | TypeScript declarations cho package đã gỡ |
| `src/types/blossom-modules.d.ts` | Như trên |

### Files đã sao lưu trước khi sửa

Folder `_backup_before_performance_optimize/` chứa snapshot của:

```
src/app/layout.tsx, page.tsx
src/components/sections/*.tsx  (hero, about, process, work, contact, services)
src/components/site/*.tsx       (preloader, cursor, cursor-spotlight, aurora-flow,
                                  sparkle-drift, floating-shapes, atmospheric-layers)
src/components/animations/*.tsx (typing-text, tilt, letter-reveal,
                                  scroll-text-reveal, animated-eyebrow)
src/components/providers/*.tsx  (page-entrance, smooth-scroll-provider)
src/lib/hooks/use-low-end-device.ts
src/lib/sound/provider.tsx
package.json
```

Folder này đã được thêm vào `.gitignore` để không lên repo. Có thể xoá thủ công khi anh đã xác nhận tối ưu OK.

## `public/` — Asset breakdown

| Subfolder | Size | Notes |
|---|---|---|
| `experience/travel/` | 47 MB | 14 ảnh JPG/PNG, có 3 file ≥6 MB |
| `experience/margroup/` | 25 MB | 14 ảnh, có 4 file ≥4 MB |
| `experience/sintech/` | 8.7 MB | 17 ảnh, hầu hết ≤1 MB |
| `awards/` | 6.1 MB | 4 ảnh contest poster |
| `music/portfolio-bgm.mp3` | 4.3 MB | Audio file (đã đổi `preload="metadata"` để không tải ngay) |
| `portrait.png` | 3.3 MB | Bản gốc |
| `portrait-cutout.png` | 3.3 MB | Bản cắt nền, đang dùng cho Hero |
| `logo.png` | 1.85 MB | 6250×6250 px (quá to cho 48px display) |

### File NGHI VẤN có thể tối ưu thêm (cần anh xác nhận)

| File | Vấn đề | Hành động khuyến nghị |
|---|---|---|
| `portrait.png` | Duplicate với portrait-cutout.png? | Nếu chỉ Hero dùng portrait-cutout, có thể xoá portrait.png (−3.3 MB) |
| `logo.png` 6250×6250 | Quá lớn so với hiển thị 48 px | Resize 256×256 ~30 KB (giảm 1.85 MB) |
| `experience/travel/tientram.jpg` 9.2 MB | JPG chưa optimize | Nén bằng Squoosh xuống ~800 KB |
| `experience/travel/event-3.jpg` 9.2 MB | Như trên | Như trên |
| `experience/travel/event-1.jpg` 6.2 MB | Như trên | Như trên |
| 4 files margroup ≥4 MB | Như trên | Như trên |

**KHÔNG xoá** mà chỉ nén — Next.js Image tự optimize khi serve, nhưng public/ size sẽ giảm khi origin file nhỏ hơn. Em không thực hiện vì cần anh xác nhận chất lượng visual.

## `.next/` Build output

Build production sau khi tối ưu:
- 13 MB (chỉ đầu ra production, đã skip dev cache)
- TypeScript check: 4.4s
- Static page generation: 10/10 pages OK
- 4 dynamic routes (work/[slug])

## `.gitignore` — Update

Đã thêm folder backup vào ignore:

```diff
# typescript
*.tsbuildinfo
next-env.d.ts

+ # performance audit + size report (regenerated each run; can opt in if needed)
+ _backup_before_performance_optimize/
```

Các mục đã có sẵn trong `.gitignore` và vẫn được giữ:
- `/node_modules`
- `/.next/`
- `.env*`
- `*.tsbuildinfo`
- `.vercel`

## Tóm tắt

```
WORKING DIR  : 1.5 GB → 602 MB         (-60%)
node_modules :  700 MB → 489 MB         (-30%)
.next cache  :  700 MB →  13 MB          (-98%, regenerates on next build)
public/      :   99 MB →  99 MB          (giữ nguyên, có note về asset cần nén)
JS bundle    : ~?    KB → ?              (đo sau khi deploy Vercel)

Repo trên GitHub: ~104 MB (không đổi)
Vercel deploy:    ~104 MB (không đổi)
```
