import { describe, expect, it, vi } from "vitest";
import { insertNote, readNotes, type createNotesClient } from "@/lib/notes.server";

describe("Notes data rules", () => {
  it("requests newest notes first", async () => {
    const order = vi.fn();
    order.mockReturnValueOnce({ order }).mockResolvedValueOnce({ data: [], error: null });
    const select = vi.fn().mockReturnValue({ order });
    const from = vi.fn().mockReturnValue({ select });
    await readNotes({ from } as unknown as ReturnType<typeof createNotesClient>);
    expect(from).toHaveBeenCalledWith("notes");
    expect(order).toHaveBeenNthCalledWith(1, "created_at", { ascending: false, nullsFirst: false });
  });

  it("inserts the note body without changing existing notes", async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    const update = vi.fn();
    const remove = vi.fn();
    const from = vi.fn().mockReturnValue({ insert, update, delete: remove });
    await insertNote({ from } as unknown as ReturnType<typeof createNotesClient>, "A new note");
    expect(insert).toHaveBeenCalledWith({ body: "A new note" });
    expect(update).not.toHaveBeenCalled();
    expect(remove).not.toHaveBeenCalled();
  });
});