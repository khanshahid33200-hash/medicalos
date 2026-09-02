import { createServerClient, type CookieOptions } from "@supabase/ssr";

const supabaseUrl = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) || "https://taszwtgrgvhkjvqdieqh.supabase.co";
const supabaseKey = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) || "sb_publishable_GgFVVkVVTSjAUzgDMfjU-w_QyA-Y0fs";

export const createClient = (request: any, responseObj?: any) => {
  let supabaseResponse = responseObj || {
    headers: new Headers(),
    cookies: {
      set: () => {},
    }
  };

  const supabase = createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return request?.cookies?.getAll ? request.cookies.getAll() : []
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: CookieOptions }>) {
          cookiesToSet.forEach(({ name, value, options }) => {
            if (request?.cookies?.set) {
              request.cookies.set(name, value)
            }
            if (supabaseResponse?.cookies?.set) {
              supabaseResponse.cookies.set(name, value, options)
            }
          })
        },
      },
    },
  );

  return { supabase, response: supabaseResponse }
};
