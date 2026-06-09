// 3 experience entries with real images integrated from anh's folders.

export type ExpImage = {
  src: string;
  alt: string;
  caption?: { en: string; vi: string };
  aspect?: "portrait" | "landscape" | "square";
};

export type ExpProgram = {
  title: string;
  role: string;
  date: string;
  image?: ExpImage;
};

export type ExperienceItem = {
  step: string;
  org: string;
  shortOrg: string;
  role: { en: string; vi: string };
  duration: { en: string; vi: string };
  hero?: ExpImage;
  campaignName?: { en: string; vi: string };
  campaignContext?: { en: string; vi: string };
  programs?: ExpProgram[];
  responsibilities: { en: string; vi: string; image?: ExpImage }[];
  gallery: ExpImage[];
};

export const experienceItems: ExperienceItem[] = [
  // ─── 01 — TRAVELGROUP UEH ─────────────────────────────────────
  {
    step: "01",
    org: "TRAVELGROUP UEH",
    shortOrg: "Travelgroup",
    role: {
      en: "Tourism Research Student Club",
      vi: "Nhóm sinh viên nghiên cứu Du Lịch",
    },
    duration: { en: "2024", vi: "2024" },
    campaignName: {
      en: "Fiesta — Outdoor Training Camp",
      vi: "Fiesta — Chương trình Tập huấn Dã ngoại",
    },
    campaignContext: {
      en: "Hà Tiên, Kiên Giang · June 2024 · Lead team Hoạt náo",
      vi: "Hà Tiên, Kiên Giang · 06/2024 · Lead team Hoạt náo",
    },
    // Docx spec: "Bên trái là hình Nam với áo Travelgroup UEH ⅓ khung hình"
    // → Photo of Nam wearing blue Travel shirt + Travel-pattern scarf, leading team Hoạt Náo.
    hero: {
      src: "/experience/travel/hoatnao-2.jpg",
      alt: "Lê Phương Nam — áo Travelgroup UEH, Lead team Hoạt Náo",
      aspect: "portrait",
    },
    programs: [
      {
        title: "Chương trình tập huấn Dã ngoại 'Fiesta'",
        role: "Lead team Hoạt Náo",
        date: "06/2024",
        image: {
          src: "/experience/travel/poster-lead-hoatnao.jpg",
          alt: "Fiesta poster",
          aspect: "portrait",
        },
      },
      {
        title: "Chương trình Tìm kiếm CTV — Vòng 3",
        role: "Lead team",
        date: "10/2024",
        image: {
          src: "/experience/travel/poster-leadteam-v3.jpg",
          alt: "Lead team V3 tuyển CTV",
          aspect: "portrait",
        },
      },
      {
        title: "Chương trình Tìm kiếm CTV — Vòng 2",
        role: "Lead team",
        date: "04/2024",
        image: {
          src: "/experience/travel/poster-leadteam-v2.jpg",
          alt: "Lead team V2 tuyển CTV",
          aspect: "portrait",
        },
      },
      {
        title: "Chiến dịch nâng cao nhận thức Du lịch",
        role: "Vice team Lễ tân",
        date: "2024",
        image: {
          src: "/experience/travel/poster-vice-letan.jpg",
          alt: "Vice Lễ tân PVDH",
          aspect: "portrait",
        },
      },
      {
        title: "Chương trình Tình nguyện",
        role: "Vice team Chương trình",
        date: "03/2024",
        image: {
          src: "/experience/travel/poster-vice-volunteer.jpg",
          alt: "Vice Chương trình Tình nguyện",
          aspect: "portrait",
        },
      },
    ],
    responsibilities: [
      {
        en: "Budgeting",
        vi: "Dự trù kinh phí",
        image: {
          src: "/experience/travel/skill-budget.png",
          alt: "Bảng dự trù kinh phí",
          aspect: "landscape",
        },
      },
      {
        en: "Location scouting",
        vi: "Tiền trạm — khảo sát địa điểm",
        image: {
          src: "/experience/travel/tientram.jpg",
          alt: "Tiền trạm — khảo sát địa điểm",
          aspect: "landscape",
        },
      },
      {
        en: "Booth & comms game ideation",
        vi: "Lên ý tưởng game booth truyền thông",
        image: {
          src: "/experience/travel/skill-booth.png",
          alt: "Ý tưởng booth",
          aspect: "landscape",
        },
      },
      {
        en: "Hoạt náo game ideation",
        vi: "Lên ý tưởng game Hoạt náo",
        image: {
          src: "/experience/travel/skill-hoatnao-ideas.png",
          alt: "Ý tưởng Hoạt náo",
          aspect: "landscape",
        },
      },
      {
        en: "Interviewing CTV candidates",
        vi: "Phỏng vấn CTV tiềm năng",
        image: {
          src: "/experience/travel/skill-interview.jpg",
          alt: "Phỏng vấn",
          aspect: "landscape",
        },
      },
      {
        en: "Timeline planning",
        vi: "Lên timeline",
        image: {
          src: "/experience/travel/skill-location.png",
          alt: "Lịch trình tour theo ngày",
          aspect: "landscape",
        },
      },
      {
        en: "Tour guiding",
        vi: "Dẫn tour",
        image: {
          src: "/experience/travel/dantour.jpg",
          alt: "Dẫn tour",
          aspect: "landscape",
        },
      },
    ],
    gallery: [
      { src: "/experience/travel/event-1.jpg", alt: "Event 1", aspect: "landscape" },
      { src: "/experience/travel/event-2.jpg", alt: "Event 2", aspect: "landscape" },
      { src: "/experience/travel/event-3.jpg", alt: "Event 3", aspect: "landscape" },
      { src: "/experience/travel/event-4.jpg", alt: "Event 4", aspect: "landscape" },
      { src: "/experience/travel/hoatnao-1.jpg", alt: "Hoạt náo", aspect: "landscape" },
      { src: "/experience/travel/hoatnao-2.jpg", alt: "Hoạt náo 2", aspect: "landscape" },
    ],
  },

  // ─── 02 — MARGROUP UEH ─────────────────────────────────────
  {
    step: "02",
    org: "MARGROUP UEH",
    shortOrg: "Margroup",
    role: {
      en: "Marketing Research Student Club",
      vi: "Nhóm sinh viên nghiên cứu Marketing",
    },
    duration: { en: "2024", vi: "2024" },
    campaignName: {
      en: "Project U — Celebrate what makes u, u!",
      vi: "Project U — Celebrate what makes u, u!",
    },
    campaignContext: {
      en: "CTV Recruitment Campaign · Vice Team QHSV",
      vi: "Chương trình Tìm kiếm CTV · Vice Team QHSV",
    },
    // Docx spec: "Bên trái là hình Nam với áo Margroup UEH ⅓ khung hình"
    // → Nam mặc áo polo đỏ Margroup, CMO Think and Action 2024 event card.
    hero: {
      src: "/experience/margroup/nam-margroup.jpg",
      alt: "Lê Phương Nam — áo polo Margroup UEH, CMO Think and Action 2024",
      aspect: "portrait",
    },
    programs: [
      {
        title: "PRESSURE? NO! PRESS \"SURE\" — Tìm kiếm CTV tháng 12",
        role: "Team Content · Student Relationship · Event",
        date: "12/2024",
        image: {
          src: "/experience/margroup/m1-pressure.jpg",
          alt: "PRESSURE? NO! PRESS SURE — Tìm kiếm CTV tháng 12",
          aspect: "portrait",
        },
      },
      {
        title: "CMO Think and Action 2024 — X-Finity War",
        role: "Event",
        date: "06–07/2024",
        image: {
          src: "/experience/margroup/m2-xfinity-war.jpg",
          alt: "CMO Think and Action 2024 — X-Finity War",
          aspect: "portrait",
        },
      },
      {
        title: "CMO Talking 2024 — Shoppertainment",
        role: "Communication",
        date: "11/2024",
        image: {
          src: "/experience/margroup/m3-shoppertainment.jpg",
          alt: "CMO Talking 2024 — Shoppertainment",
          aspect: "portrait",
        },
      },
      {
        title: "Project \"U\" — Celebrate what makes u, U",
        role: "Vice Team Quan hệ sinh viên",
        date: "05/2024",
        image: {
          src: "/experience/margroup/m4-project-u.jpg",
          alt: "Project U — Tìm kiếm CTV tháng 5",
          aspect: "portrait",
        },
      },
      {
        title: "Z Sao Ép! — Say \"Zét\", sao phải ép",
        role: "Event",
        date: "11/2023",
        image: {
          src: "/experience/margroup/m5-zsao-ep.jpg",
          alt: "Z Sao Ép — Tìm kiếm CTV tháng 11/2023",
          aspect: "portrait",
        },
      },
    ],
    responsibilities: [
      {
        en: "Meeting minutes",
        vi: "Viết Biên Bản Họp",
        image: {
          src: "/experience/margroup/skill-meeting-1.png",
          alt: "Biên bản họp",
          aspect: "portrait",
        },
      },
      {
        en: "Workshop survey",
        vi: "Khảo sát xưởng",
        image: {
          src: "/experience/margroup/skill-workshop-survey.png",
          alt: "Khảo sát xưởng",
          aspect: "landscape",
        },
      },
      {
        en: "Result emails",
        vi: "Viết mail gửi kết quả phỏng vấn",
        image: {
          src: "/experience/margroup/skill-mail.png",
          alt: "Mail gửi sinh viên",
          aspect: "portrait",
        },
      },
      {
        en: "Risk management matrix",
        vi: "Lập bảng quản trị rủi ro",
        image: {
          src: "/experience/margroup/skill-risk-mgmt.png",
          alt: "Quản trị rủi ro",
          aspect: "landscape",
        },
      },
      {
        en: "Acti script",
        vi: "Viết kịch bản ACTI",
        image: {
          src: "/experience/margroup/skill-script-acti.png",
          alt: "Kịch bản ACTI",
          aspect: "landscape",
        },
      },
      {
        en: "Team timeline planning",
        vi: "Lên timeline cho team",
        image: {
          src: "/experience/margroup/skill-timeline.png",
          alt: "Timeline",
          aspect: "landscape",
        },
      },
      {
        en: "Booth concept design",
        vi: "Lên ý tưởng dựng booth truyền thông",
        image: {
          src: "/experience/margroup/skill-booth-idea.png",
          alt: "Ý tưởng dựng booth truyền thông",
          aspect: "landscape",
        },
      },
      {
        en: "Big idea — key message — key visual",
        vi: "Lên ý tưởng Big idea — key message — key visual",
        image: {
          src: "/experience/margroup/skill-keyvisual.png",
          alt: "Big idea · Key message · Key visual",
          aspect: "landscape",
        },
      },
    ],
    gallery: [
      {
        src: "/experience/margroup/team-content.jpg",
        alt: "Team Content",
        aspect: "landscape",
      },
      {
        src: "/experience/margroup/team-event-setlog-1.jpg",
        alt: "Team Event — Subteam Set-Log (1)",
        aspect: "landscape",
      },
      {
        src: "/experience/margroup/team-student-rel.jpg",
        alt: "Team Student Relationship",
        aspect: "landscape",
      },
      {
        src: "/experience/margroup/event-cmo-reception.jpg",
        alt: "Event Reception — CMO Think and Action 2024",
        aspect: "landscape",
      },
      {
        src: "/experience/margroup/team-event-setlog-2.jpg",
        alt: "Team Event — Subteam Set-Log (2)",
        aspect: "landscape",
      },
      {
        src: "/experience/margroup/team-comm-pr.jpg",
        alt: "Team Communication — Subteam PR-Activation",
        aspect: "landscape",
      },
      {
        src: "/experience/margroup/team-qhsv-leads.jpg",
        alt: "Team Quan hệ sinh viên — Leader & Vice Leader (Nam)",
        aspect: "landscape",
      },
    ],
  },

  // ─── 03 — SINTECH ─────────────────────────────────────
  {
    step: "03",
    org: "SINTECH Computer Technology Co., Ltd",
    shortOrg: "Sintech",
    role: {
      en: "Marketing & Operations Executive Intern",
      vi: "Marketing & Operations Executive Intern",
    },
    duration: { en: "2025", vi: "2025" },
    campaignName: {
      en: "Sintech PC Gaming & Gear — Fanpage & E-commerce",
      vi: "Sintech PC Gaming & Gear — Fanpage & E-commerce",
    },
    campaignContext: {
      en: "Real internship · 7K fanpage followers managed",
      vi: "Internship thực tế · Quản lý fanpage 7K theo dõi",
    },
    hero: {
      src: "/experience/sintech/fanpage.png",
      alt: "Sintech PC Gaming & Gear Fanpage",
      aspect: "landscape",
    },
    responsibilities: [
      {
        en: "Company fanpage management",
        vi: "Quản lý fanpage Công ty",
        image: {
          src: "/experience/sintech/fanpage.png",
          alt: "Fanpage management",
          aspect: "landscape",
        },
      },
      {
        en: "Fanpage content writing",
        vi: "Viết bài content fanpage Công ty",
        image: {
          src: "/experience/sintech/fb-content.png",
          alt: "FB content",
          aspect: "landscape",
        },
      },
      {
        en: "Website UI/UX assurance",
        vi: "Hỗ trợ đảm bảo hình ảnh website",
        image: {
          src: "/experience/sintech/uxui-1.jpg",
          alt: "UX UI Web",
          aspect: "landscape",
        },
      },
      {
        en: "SEO-optimised e-commerce content",
        vi: "Viết content SEO cho website bán hàng",
        image: {
          src: "/experience/sintech/seo-1.jpg",
          alt: "SEO content",
          aspect: "landscape",
        },
      },
      {
        en: "Promotion campaigns co-creation",
        vi: "Xây dựng các chương trình ưu đãi",
        image: {
          src: "/experience/sintech/campaign-1.jpg",
          alt: "Campaign",
          aspect: "landscape",
        },
      },
      {
        en: "Zalo OA customer-care system",
        vi: "Xây dựng hệ thống Zalo OA chăm sóc khách hàng",
        image: {
          src: "/experience/sintech/zalo-oa-1.jpg",
          alt: "Zalo OA",
          aspect: "landscape",
        },
      },
    ],
    gallery: [
      { src: "/experience/sintech/campaign-1.jpg", alt: "Campaign 1", aspect: "landscape" },
      { src: "/experience/sintech/campaign-2.jpg", alt: "Campaign 2", aspect: "landscape" },
      { src: "/experience/sintech/campaign-3.jpg", alt: "Campaign 3", aspect: "landscape" },
      { src: "/experience/sintech/campaign-4.jpg", alt: "Campaign 4", aspect: "landscape" },
      { src: "/experience/sintech/campaign-5.jpg", alt: "Campaign 5", aspect: "landscape" },
      { src: "/experience/sintech/campaign-6.jpg", alt: "Campaign 6", aspect: "landscape" },
      { src: "/experience/sintech/seo-1.jpg", alt: "SEO 1", aspect: "landscape" },
      { src: "/experience/sintech/seo-2.jpg", alt: "SEO 2", aspect: "landscape" },
      { src: "/experience/sintech/seo-3.jpg", alt: "SEO 3", aspect: "landscape" },
      { src: "/experience/sintech/seo-4.jpg", alt: "SEO 4", aspect: "landscape" },
      { src: "/experience/sintech/seo-5.jpg", alt: "SEO 5", aspect: "landscape" },
      { src: "/experience/sintech/seo-6.jpg", alt: "SEO 6", aspect: "landscape" },
      { src: "/experience/sintech/uxui-1.jpg", alt: "UX UI 1", aspect: "landscape" },
      { src: "/experience/sintech/uxui-2.jpg", alt: "UX UI 2", aspect: "landscape" },
      { src: "/experience/sintech/uxui-3.jpg", alt: "UX UI 3", aspect: "landscape" },
      { src: "/experience/sintech/zalo-oa-1.jpg", alt: "Zalo OA 1", aspect: "landscape" },
      { src: "/experience/sintech/zalo-oa-2.jpg", alt: "Zalo OA 2", aspect: "landscape" },
      { src: "/experience/sintech/store.jpg", alt: "Store", aspect: "landscape" },
    ],
  },
];

// Backwards-compat for any imports of processSteps
export const processSteps = experienceItems.map((e) => ({
  step: e.step,
  duration: e.duration,
  title: e.role,
  description: {
    en: `${e.org} — ${e.responsibilities.slice(0, 3).map((r) => r.en).join(", ")}...`,
    vi: `${e.org} — ${e.responsibilities.slice(0, 3).map((r) => r.vi).join(", ")}...`,
  },
}));
