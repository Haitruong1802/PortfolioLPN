import {
  Search,
  Presentation,
  ClipboardList,
  Users,
  Clock,
  Sparkles,
  Bot,
  PenTool,
  FileSpreadsheet,
} from "lucide-react";

export type SkillGroupKey = "hard" | "soft" | "tools";

export type SkillItem = {
  icon: typeof Search;
  title: { en: string; vi: string };
  description: { en: string; vi: string };
};

export type SkillGroup = {
  key: SkillGroupKey;
  label: { en: string; vi: string };
  items: SkillItem[];
};

export const skillGroups: SkillGroup[] = [
  {
    key: "hard",
    label: { en: "Hard Skills", vi: "Hard Skills" },
    items: [
      {
        icon: Search,
        title: {
          en: "Brief & Research",
          vi: "Tiếp nhận Brief & Research",
        },
        description: {
          en: "Analyse the brief and research the brand, industry, target audience, trends, and case studies that power the project.",
          vi: "Phân tích yêu cầu từ brief; research thương hiệu, ngành hàng, đối tượng mục tiêu, xu hướng và case study phục vụ dự án.",
        },
      },
      {
        icon: Presentation,
        title: {
          en: "Sponsor Deck & Feedback",
          vi: "Sponsor Deck & Feedback",
        },
        description: {
          en: "Build and update sponsor decks; curate content, visuals, and numbers; refine the document from feedback rounds.",
          vi: "Hỗ trợ xây dựng, cập nhật sponsor deck; chọn lọc nội dung, hình ảnh, số liệu và chỉnh sửa tài liệu theo feedback.",
        },
      },
      {
        icon: ClipboardList,
        title: {
          en: "Recap, WIP & Task Tracking",
          vi: "Recap, WIP & Theo dõi công việc",
        },
        description: {
          en: "Capture discussion notes, write recaps; update WIP, track progress, review documents, and follow up on open tasks.",
          vi: "Ghi nhận nội dung trao đổi, tổng hợp recap; cập nhật WIP, theo dõi tiến độ, kiểm tra tài liệu và các đầu việc cần tiếp tục xử lý.",
        },
      },
    ],
  },
  {
    key: "soft",
    label: { en: "Soft Skills", vi: "Soft Skills" },
    items: [
      {
        icon: Users,
        title: {
          en: "Communication & Teamwork",
          vi: "Giao tiếp & Làm việc nhóm",
        },
        description: {
          en: "Communicating clearly and acting as a bridge that keeps every stakeholder in sync.",
          vi: "Truyền đạt thông tin rành mạch, đóng vai trò cầu nối phối hợp nhịp nhàng giữa các bên liên quan.",
        },
      },
      {
        icon: Clock,
        title: {
          en: "Time Management & Problem Solving",
          vi: "Quản trị thời gian & Xử lý vấn đề",
        },
        description: {
          en: "Allocating resources effectively under tight timelines and adapting on the fly when issues arise.",
          vi: "Phân bổ nguồn lực hiệu quả trong giới hạn thời gian, linh hoạt ứng biến trước rủi ro phát sinh.",
        },
      },
      {
        icon: Sparkles,
        title: {
          en: "Learning & Adapting",
          vi: "Học hỏi & Thích nghi",
        },
        description: {
          en: "Picking things up fast and actively updating my knowledge to keep up with the constant pace of campaigns.",
          vi: "Tốc độ tiếp thu nhanh, chủ động cập nhật kiến thức để bắt kịp nhịp độ thay đổi liên tục của các chiến dịch.",
        },
      },
    ],
  },
  {
    key: "tools",
    label: { en: "Tools & Technologies", vi: "Tools & Technologies" },
    items: [
      {
        icon: Bot,
        title: {
          en: "AI Agents",
          vi: "Trợ lý AI (AI Agents)",
        },
        description: {
          en: "Putting AI tools to work to automate information management and optimise productivity.",
          vi: "Ứng dụng các công cụ trí tuệ nhân tạo nhằm tự động hóa quy trình quản lý thông tin và tối ưu hóa hiệu suất.",
        },
      },
      {
        icon: PenTool,
        title: {
          en: "Proposal Design (Canva)",
          vi: "Thiết kế Proposal (Canva)",
        },
        description: {
          en: "Turning ideas into proposals and presentation decks that are both visually engaging and on-brand.",
          vi: "Trực quan hóa ý tưởng thành các bản đề xuất, tài liệu trình bày sinh động và mang tính thẩm mỹ cao.",
        },
      },
      {
        icon: FileSpreadsheet,
        title: {
          en: "Microsoft & Google Suite",
          vi: "Microsoft & Google Suite",
        },
        description: {
          en: "Fluent across office productivity tools for documents, spreadsheets, and shared workspace management.",
          vi: "Thành thạo hệ sinh thái tin học văn phòng để xử lý văn bản, trang tính và quản lý không gian làm việc chung.",
        },
      },
    ],
  },
];

// Flattened list backwards-compatible with existing Services section
export const services = skillGroups.flatMap((g) =>
  g.items.map((item) => ({
    icon: item.icon,
    title: item.title,
    description: item.description,
    tags: [g.label.en],
  })),
);
