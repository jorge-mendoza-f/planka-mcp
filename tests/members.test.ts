import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../src/client.js", () => ({
  plankaClient: { post: vi.fn(), delete: vi.fn() },
}));

import { plankaClient } from "../src/client.js";
import { PlankaError } from "../src/errors.js";
import { setCardMembers } from "../src/operations/members.js";

const post = vi.mocked(plankaClient.post);
const del = vi.mocked(plankaClient.delete);

const membership = (userId: string) => ({
  item: { id: `m-${userId}`, cardId: "c1", userId, createdAt: "2026-01-01T00:00:00Z" },
});

describe("setCardMembers", () => {
  beforeEach(() => vi.clearAllMocks());

  it("removes then adds members via card-memberships endpoints", async () => {
    post.mockResolvedValue(membership("u1"));

    await setCardMembers("c1", ["u1"], ["u2"]);

    expect(del).toHaveBeenCalledWith("/api/cards/c1/card-memberships/userId:u2");
    expect(post).toHaveBeenCalledWith("/api/cards/c1/card-memberships", { userId: "u1" });
    expect(del.mock.invocationCallOrder[0]).toBeLessThan(post.mock.invocationCallOrder[0]);
  });

  it("ignores users already on the card", async () => {
    post.mockRejectedValue(new PlankaError("User already card member", "API_ERROR", 409));

    await expect(setCardMembers("c1", ["u1"])).resolves.toBeUndefined();
  });

  it("surfaces other errors", async () => {
    post.mockRejectedValue(new PlankaError("Forbidden", "PERMISSION_DENIED", 403));

    await expect(setCardMembers("c1", ["u1"])).rejects.toThrow("Forbidden");
  });
});
