"use server";

type ContactInput = {
  name: string;
  email: string;
  company?: string;
  budget?: string;
  projectType?: string;
  message: string;
};

export type ContactResult =
  | { ok: true; message: string }
  | { ok: false; error: string; field?: keyof ContactInput };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContact(
  _prev: ContactResult | null,
  formData: FormData,
): Promise<ContactResult> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const budget = String(formData.get("budget") ?? "").trim();
  const projectType = String(formData.get("projectType") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const honeypot = String(formData.get("website") ?? "").trim();

  if (honeypot) return { ok: true, message: "Thanks!" };

  if (!name) return { ok: false, error: "Vui lòng nhập tên", field: "name" };
  if (!email || !EMAIL_RE.test(email))
    return { ok: false, error: "Email không hợp lệ", field: "email" };
  if (!message || message.length < 20)
    return {
      ok: false,
      error: "Vui lòng viết tin nhắn ít nhất 20 ký tự",
      field: "message",
    };

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? "hello@example.com";
  const FROM_EMAIL =
    process.env.RESEND_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";

  if (!RESEND_API_KEY) {
    console.warn(
      "[contact] RESEND_API_KEY not set — submission logged but not emailed.",
      { name, email, company, budget, projectType, message },
    );
    return {
      ok: true,
      message:
        "Đã nhận tin nhắn (chế độ dev — chưa cấu hình Resend nên chưa gửi email).",
    };
  }

  const text = [
    `New contact form submission`,
    ``,
    `Name: ${name}`,
    `Email: ${email}`,
    company ? `Company: ${company}` : null,
    budget ? `Budget: ${budget}` : null,
    projectType ? `Project type: ${projectType}` : null,
    ``,
    `Message:`,
    message,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: TO_EMAIL,
        reply_to: email,
        subject: `[Portfolio] New lead from ${name}`,
        text,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[contact] Resend error", res.status, body);
      return {
        ok: false,
        error: "Có lỗi khi gửi tin nhắn, vui lòng thử lại hoặc email trực tiếp.",
      };
    }

    return {
      ok: true,
      message: "Đã gửi thành công — em sẽ reply trong 24h.",
    };
  } catch (err) {
    console.error("[contact] Network error", err);
    return {
      ok: false,
      error: "Có lỗi kết nối, vui lòng thử lại.",
    };
  }
}
