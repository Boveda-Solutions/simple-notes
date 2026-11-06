import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { listNotes, saveNote } from "@/lib/notes.functions";

const notesQuery = queryOptions({ queryKey: ["notes"], queryFn: () => listNotes() });

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(notesQuery),
  head: () => ({
    meta: [
      { title: "Notes — lovable-env-test" },
      { name: "description", content: "Read and add notes in lovable-env-test." },
      { property: "og:title", content: "Notes — lovable-env-test" },
      { property: "og:description", content: "Read and add notes in lovable-env-test." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  const initialNotes = Route.useLoaderData();
  const { data: notes } = useSuspenseQuery({ ...notesQuery, initialData: initialNotes });
  const queryClient = useQueryClient();
  const save = useServerFn(saveNote);
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState("");
  const mutation = useMutation({
    mutationFn: (body: string) => save({ data: { body } }),
    onSuccess: () => {
      setBody("");
      setEditing(false);
      void queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!mutation.isPending) mutation.mutate(body);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <h1 className="text-lg font-semibold">lovable-env-test Notes</h1>
          <Button size="sm" disabled={editing} onClick={() => { mutation.reset(); setEditing(true); }}>
            New note
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-12">
        {editing && (
          <form onSubmit={submit} className="mb-8 space-y-3">
            <label htmlFor="note-body" className="block text-sm font-medium">Note</label>
            <Textarea id="note-body" autoFocus value={body} onChange={(event) => setBody(event.target.value)} disabled={mutation.isPending} rows={4} />
            {mutation.isError && <p role="alert" className="text-sm text-destructive">Could not save your note. Please try again.</p>}
            <div className="flex gap-2">
              <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Saving…" : "Save note"}</Button>
              <Button type="button" variant="outline" disabled={mutation.isPending} onClick={() => { setEditing(false); setBody(""); mutation.reset(); }}>Cancel</Button>
            </div>
          </form>
        )}
        <ul aria-label="Notes" className="divide-y divide-border">
          {notes.map((note) => <li key={note.id} className="whitespace-pre-wrap break-words py-4">{note.body}</li>)}
        </ul>
        {notes.length === 0 && <p className="text-center text-muted-foreground">No notes yet.</p>}
      </main>
    </div>
  );
}
