export type CaseStudy = {
  slug: string;
  title: { en: string; vi: string };
  client: string;
  category: string;
  year: number;
  metrics: { label: string; value: string }[];
  summary: { en: string; vi: string };
  tags: string[];
  accent: "orange" | "blue" | "amber" | "primary";
  image?: string;
  imageAlt?: string;
  /** CSS aspect-ratio for the contest image frame.
   *  Match the source image so it fills the frame without letterbox.
   *  Defaults to "5/4" if omitted. */
  imageAspect?: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "startup-zone-2025",
    title: {
      en: "Top 5 Startup Zone 2025",
      vi: "Top 5 Khởi nghiệp Startup Zone 2025",
    },
    client: "UEH University",
    category: { en: "Startup Competition", vi: "Cuộc thi Khởi nghiệp" }.vi,
    year: 2025,
    metrics: [
      { label: "Result", value: "TOP 5" },
      { label: "Team", value: "The Igniters" },
      { label: "Round", value: "Gala Final" },
    ],
    summary: {
      en: "Reached Top 5 (Khuyến khích) at Startup Zone 2025 Gala Final, themed TRANSITION, an annual startup competition hosted by University of Economics Ho Chi Minh City (UEH) focused on green energy and emission reduction. Passed 4 competition rounds while operating the team to find distinctive USPs so we could stand out before the judging panel. The competition tested not only entrepreneurship knowledge but also a journey of customer empathy, effective marketing, and turning the ordinary into the extraordinary.",
      vi: "Đạt Top 5 (Giải Khuyến Khích) tại Gala Chung Kết Startup Zone 2025 chủ đề TRANSITION, cuộc thi khởi nghiệp thường niên do Đại học Kinh tế TP.HCM (UEH) tổ chức xoay quanh chủ đề năng lượng xanh và giảm phát thải. Vượt qua 4 vòng thi, vận hành team tìm các USP khác biệt để team có thể trở nên nổi bật trước các BGK. Cuộc thi không chỉ vận dụng kiến thức khởi nghiệp mà còn là hành trình thấu hiểu khách hàng, làm Marketing hiệu quả và biến những điều bình thường trở nên nổi bật.",
    },
    tags: ["Startup", "UEH", "Pitching", "Team Lead"],
    accent: "orange",
    image: "/awards/startup-zone-2025.jpg",
    imageAlt: "Đội The Igniters — Top 5 Gala Chung Kết Startup Zone 2025",
    imageAspect: "1/1",
  },
  {
    slug: "techseed-2025",
    title: {
      en: "Top 20 Techseed 2025",
      vi: "Top 20 Khởi nghiệp Công nghệ Techseed 2025",
    },
    client: "TIKERA",
    category: "Cuộc thi Khởi nghiệp Công nghệ",
    year: 2026,
    metrics: [
      { label: "Result", value: "TOP 20" },
      { label: "Team", value: "BETA-CAREER" },
      { label: "Date", value: "09.02.2026" },
    ],
    summary: {
      en: "Reached Top 20 at Techseed 2025, a tech-entrepreneurship competition hosted by TIKERA that gathers startup teams from universities across the country. Together with team BETA-CAREER, built a technology solution rooted in real customer insight, learning to turn a raw idea into a convincing product. The competition trained Nam in product-market-fit thinking, cross-discipline teamwork, and the composure needed to pitch in front of an expert judging panel.",
      vi: "Đạt Top 20 chung cuộc Techseed 2025, cuộc thi Khởi nghiệp Công nghệ do TIKERA tổ chức, sân chơi quy tụ các đội startup từ nhiều trường đại học trên cả nước. Cùng đội BETA-CAREER xây dựng giải pháp công nghệ từ insight thực tế của khách hàng, học cách biến ý tưởng thô thành một sản phẩm có giá trị thuyết phục. Cuộc thi giúp Nam rèn tư duy product-market fit, kỹ năng làm việc nhóm xuyên ngành và bản lĩnh thuyết trình trước hội đồng giám khảo chuyên môn.",
    },
    tags: ["Tech Startup", "TIKERA", "Innovation"],
    accent: "blue",
    image: "/awards/techseed-2025.jpg",
    imageAlt: "Giấy chứng nhận Top 20 Techseed 2025 — đội BETA-CAREER",
    imageAspect: "7/5",
  },
  {
    slug: "giai-ma-ma-tran-nhan-su",
    title: {
      en: "Top 12 HR Matrix Decoded",
      vi: "Top 12 Giải mã Ma trận Nhân sự",
    },
    client: "UEH University",
    category: "Cuộc thi HR / Marketing",
    year: 2025,
    metrics: [
      { label: "Result", value: "TOP 12" },
      { label: "Year", value: "2025" },
      { label: "Org", value: "UEH" },
    ],
    summary: {
      en: "Reached Top 12 at Giải mã Ma trận Nhân sự, hosted by HuReA Club (Aspiring HR Specialists) at UEH, an annual academic competition exclusively for Human Resource Management students. Combined HR insight with marketing strategy to crack real organisational case studies, learning to see people inside the corporate machine through a strategic lens. The competition nurtured multi-dimensional analytical thinking, team collaboration, and the ability to tell a compelling solution story for complex HR situations.",
      vi: "Vào Top 12 cuộc thi Giải mã Ma trận Nhân sự tại UEH, sân chơi học thuật thường niên do CLB HuReA (Chuyên viên Nhân sự Tập sự) tổ chức dành riêng cho sinh viên ngành Quản trị Nhân lực. Vận dụng insight nhân sự kết hợp chiến lược marketing để giải các case study tổ chức thực tế, Nam học cách nhìn nhận con người trong bộ máy doanh nghiệp dưới lăng kính chiến lược. Cuộc thi nuôi dưỡng tư duy phân tích đa chiều, kỹ năng làm việc nhóm và khả năng kể câu chuyện giải pháp cho những tình huống HR phức tạp.",
    },
    tags: ["HR", "Strategy", "Case Study"],
    accent: "amber",
    image: "/awards/giai-ma-ma-tran-nhan-su.png",
    imageAlt: "Top 12 — Giải mã Ma trận Nhân sự",
    imageAspect: "2/1",
  },
  {
    slug: "hr-evolve",
    title: {
      en: "Top 12 Talent Avant-Garde (HR EVOLVE)",
      vi: "Top 12 Talent Avant-Garde (Nội bộ Mở rộng HR EVOLVE)",
    },
    client: "UEH University",
    category: "Cuộc thi Talent / HR",
    year: 2024,
    metrics: [
      { label: "Result", value: "TOP 12" },
      { label: "Org", value: "UEH" },
      { label: "Year", value: "2024" },
    ],
    summary: {
      en: "Reached Top 12 at Talent Avant-Garde (HR EVOLVE Nội bộ Mở rộng), themed 'Talent Avant-garde: Awake Hidden Endowments' and hosted by HuReA Club at UEH within the context of the BANI era. Going through personality assessments, HR-domain knowledge tests, and strategic case-solving challenges, Nam realised the value of understanding oneself deeply before understanding others. The competition trained self-awareness, critical thinking, and the resilience to stay sharp through long-haul challenges.",
      vi: "Đạt Top 12 Talent Avant-Garde (HR EVOLVE Nội bộ Mở rộng), mùa thi mang chủ đề 'Talent Avant-garde: Awake Hidden Endowments' do CLB HuReA tại UEH tổ chức trong bối cảnh kỷ nguyên BANI. Trải qua các bài đánh giá tính cách, kiến thức chuyên môn HR và xử lý tình huống chiến lược, Nam nhận ra giá trị của việc hiểu sâu chính bản thân trước khi hiểu người khác. Cuộc thi rèn cho Nam tư duy self-awareness, critical thinking và bản lĩnh giữ vững phong độ trước những thử thách dài hơi.",
    },
    tags: ["Talent", "Assessment", "HR"],
    accent: "primary",
    image: "/awards/talent-avant-garde.png",
    imageAlt: "Talent Avant-Garde — Kết quả Vòng 1",
    imageAspect: "2/1",
  },
];
