import { beforeEach, describe, expect, it } from "vitest";

import type { UploadQueueItem } from "@/types/media";

import { useUploadStore } from "./uploadStore";

function makeItem(overrides: Partial<UploadQueueItem> = {}): UploadQueueItem {
  return {
    id: crypto.randomUUID(),
    file: new File(["data"], "photo.jpg", { type: "image/jpeg" }),
    mediaType: "photo",
    previewUrl: "blob:mock-url",
    title: "",
    status: "queued",
    progress: 0,
    errorMessage: null,
    ...overrides,
  };
}

describe("useUploadStore", () => {
  beforeEach(() => {
    useUploadStore.setState({ items: [] });
  });

  it("adds items to the queue", () => {
    const item = makeItem();
    useUploadStore.getState().addItems([item]);

    expect(useUploadStore.getState().items).toEqual([item]);
  });

  it("updates a specific item by id", () => {
    const item = makeItem();
    useUploadStore.getState().addItems([item]);

    useUploadStore.getState().setStatus(item.id, "success", { progress: 100 });

    const updated = useUploadStore.getState().items[0];
    expect(updated?.status).toBe("success");
    expect(updated?.progress).toBe(100);
  });

  it("removes an item from the queue", () => {
    const item = makeItem();
    useUploadStore.getState().addItems([item]);

    useUploadStore.getState().removeItem(item.id);

    expect(useUploadStore.getState().items).toHaveLength(0);
  });

  it("clears only successful items", () => {
    const succeeded = makeItem({ status: "success" });
    const pending = makeItem({ status: "uploading" });
    useUploadStore.getState().addItems([succeeded, pending]);

    useUploadStore.getState().clearCompleted();

    const remaining = useUploadStore.getState().items;
    expect(remaining).toHaveLength(1);
    expect(remaining[0]?.id).toBe(pending.id);
  });
});
