import { createServerClient, type CookieOptions } from "@supabase/ssr";

const supabaseUrl = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) || "https://taszwtgrgvhkjvqdieqh.supabase.co";
const supabaseKey = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) || "sb_publishable_GgFVVkVVTSjAUzgDMfjU-w_QyA-Y0fs";

export const createClient = (cookieStore: any) => {
  return createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return typeof cookieStore?.getAll === 'function' ? cookieStore.getAll() : []
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: CookieOptions }>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              if (typeof cookieStore?.set === 'function') {
                cookieStore.set(name, value, options)
              }
            })
          } catch {
            // Ignored if called from a Server Component
          }
        },
      },
    },
  );
};
