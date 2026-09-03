import { describe, expect, it } from "vitest";

describe("environment", () => {
  it("parses valid Supabase environment variables", async () => {
    const { env } = await import("./environment");

    expect(env.supabaseUrl).toBe("https://test-project.supabase.co");
    expect(env.supabaseAnonKey).toBe("test-anon-key");
  });
});
