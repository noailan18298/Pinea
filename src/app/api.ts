const BASE = "https://ephyusamtgaatbesskbz.supabase.co/functions/v1/make-server-47481a97";

export async function fetchContent(lang: "he" | "en") {
  try {
    const res = await fetch(`${BASE}/content/${lang}`);
    const data = await res.json();
    return data.content ?? null;
  } catch {
    return null;
  }
}

export async function saveContent(lang: "he" | "en", content: object) {
  const res = await fetch(`${BASE}/content/${lang}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  return res.json();
}

export async function verifyPassword(password: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}/admin/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    return data.ok === true;
  } catch {
    return false;
  }
}
