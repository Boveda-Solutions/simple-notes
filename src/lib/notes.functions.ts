import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createNotesClient, readNotes, insertNote } from "./notes.server";

export const listNotes = createServerFn({ method: "GET" }).handler(async () => {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("Notes connection is unavailable.");
  return readNotes(createNotesClient(url, key));
});

export const saveNote = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ body: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const url = process.env["SUPABASE_URL"];
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
    if (!url || !key) throw new Error("Notes connection is unavailable.");
    return insertNote(createNotesClient(url, key), data.body);
  });