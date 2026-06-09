import type { Locale } from "./types";

export const messages = {
  vi: {
    "nav.about": "Giới thiệu",
    "nav.process": "Kinh nghiệm",
    "nav.services": "Skills",
    "nav.work": "Thành tích",
    "nav.contact": "Liên hệ",
    "cta.hire": "Liên hệ ngay",
    "cta.viewWork": "Xem thành tích",
    "cta.viewAll": "Xem tất cả",
    "hero.eyebrow": "Account Intern",
    "hero.headline.line1": "GO BIG",
    "hero.headline.line2": "GO HOME.",
    "hero.scroll": "Cuộn để khám phá",
    "about.eyebrow": "Giới thiệu",
    "about.title": "Sinh viên năm 1 · Account in-the-making",
    "about.stat.years": "Cuộc thi đạt giải",
    "about.stat.campaigns": "Nơi đã làm việc",
    "about.stat.clients": "CLB UEH tham gia",
    "services.eyebrow": "Skills & Expertise",
    "services.title": "Bộ kỹ năng của Account",
    "services.subtitle":
      "Hard skills để dẫn dắt — Soft skills để gắn kết — Tools để tăng tốc.",
    "work.eyebrow": "Thành tích",
    "work.title": "4 cuộc thi · 4 cột mốc",
    "work.subtitle":
      "Khởi nghiệp, công nghệ, nhân sự, talent — mỗi cuộc thi là một bài học khác.",
    "contact.eyebrow": "Liên hệ",
    "contact.title": "Cùng GO BIG nhé?",
    "contact.subtitle":
      "Brief event, vị trí Account, hay chỉ trao đổi — em sẵn sàng. Reply trong 24h.",
    "contact.cta.email": "Gửi email",
    "footer.rights": "Đã đăng ký bản quyền",
  },
  en: {
    "nav.about": "About",
    "nav.process": "Experience",
    "nav.services": "Skills",
    "nav.work": "Achievements",
    "nav.contact": "Contact",
    "cta.hire": "Contact now",
    "cta.viewWork": "View achievements",
    "cta.viewAll": "View all",
    "hero.eyebrow": "Account Intern",
    "hero.headline.line1": "GO BIG",
    "hero.headline.line2": "GO HOME.",
    "hero.scroll": "Scroll to explore",
    "about.eyebrow": "About",
    "about.title": "First-year · Account in-the-making",
    "about.stat.years": "Competition wins",
    "about.stat.campaigns": "Workplaces",
    "about.stat.clients": "UEH clubs joined",
    "services.eyebrow": "Skills & Expertise",
    "services.title": "An Account toolkit",
    "services.subtitle":
      "Hard skills to lead — Soft skills to connect — Tools to scale.",
    "work.eyebrow": "Achievements",
    "work.title": "4 contests · 4 milestones",
    "work.subtitle":
      "Startup, tech, HR, talent — every contest teaches a different lesson.",
    "contact.eyebrow": "Contact",
    "contact.title": "Let's GO BIG?",
    "contact.subtitle":
      "Event brief, Account Intern opening, or just a chat — I'm ready. Reply within 24h.",
    "contact.cta.email": "Send email",
    "footer.rights": "All rights reserved",
  },
} satisfies Record<Locale, Record<string, string>>;

export type MessageKey = keyof (typeof messages)[Locale];
