import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Notes — lovable-env-test" },
      { name: "description", content: "A minimal notes app shell for lovable-env-test." },
      { property: "og:title", content: "Notes — lovable-env-test" },
      { property: "og:description", content: "A minimal notes app shell for lovable-env-test." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <h1 className="text-lg font-semibold">lovable-env-test Notes</h1>
          <button
            disabled
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            New note
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-12">
        <ul aria-label="Notes" />
        <p className="text-center text-muted-foreground">No notes yet</p>
      </main>
    </div>
  );
}
