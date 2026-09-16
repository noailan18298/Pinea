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

/** Reads a File as a base64 data URL and uploads it, returning the public
 * URL of the stored image (or throwing on failure). */
export async function uploadImage(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  const res = await fetch(`${BASE}/upload-image`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file.name, dataUrl }),
  });
  const data = await res.json();
  if (!res.ok || !data.url) {
    throw new Error(data.error ?? "Upload failed");
  }
  return data.url as string;
}
