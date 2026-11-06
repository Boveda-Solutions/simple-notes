import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export function createNotesClient(url: string, key: string) {
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

export async function readNotes(client: ReturnType<typeof createNotesClient>) {
  const { data, error } = await client.from("notes")
    .select("id, body, created_at")
    .order("created_at", { ascending: false, nullsFirst: false })
    .order("id", { ascending: false });
  if (error) throw new Error("Could not load notes. Please try again.");
  return data;
}

export async function insertNote(client: ReturnType<typeof createNotesClient>, body: string) {
  const { error } = await client.from("notes").insert({ body });
  if (error) throw new Error("Could not save your note. Please try again.");
  return { saved: true };
}