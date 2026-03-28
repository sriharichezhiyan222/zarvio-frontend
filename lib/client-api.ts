"use client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://zarvio-backend.onrender.com";

type JsonRecord = Record<string, unknown>;

function readSupabaseAuth() {
  if (typeof window === "undefined") return null;

  try {
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (!key || !key.includes("-auth-token")) continue;
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (parsed?.access_token || parsed?.user?.id) return parsed;
    }
  } catch {
    return null;
  }

  return null;
}

function readZarvioAuth() {
  if (typeof window === "undefined") return null;
  try {
    const token = localStorage.getItem("zarvio_token");
    const refreshToken = localStorage.getItem("zarvio_refresh_token");
    if (!token) return null;
    return { token, refreshToken };
  } catch {
    return null;
  }
}

export function getAuthContext() {
  const zarvioAuth = readZarvioAuth();
  if (zarvioAuth?.token) {
    return {
      token: zarvioAuth.token,
      userId: undefined,
    };
  }

  const auth = readSupabaseAuth();
  return {
    token: auth?.access_token as string | undefined,
    userId: auth?.user?.id as string | undefined,
  };
}

export async function apiJson<T = unknown>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const { token } = getAuthContext();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  const json = await response.json();
  return (json?.data ?? json) as T;
}

export async function apiStream(
  path: string,
  body: JsonRecord,
  onToken: (token: string) => void
) {
  const { token } = getAuthContext();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok || !response.body) {
    throw new Error(`Stream failed: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onToken(decoder.decode(value, { stream: true }));
  }
}
