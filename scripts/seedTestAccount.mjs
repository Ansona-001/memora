// Seeds two confirmed test accounts already paired into one couple space,
// so local manual testing doesn't require registering fresh every run.
// Run against a fresh local Supabase instance: `npx supabase db reset`
// then `node scripts/seedTestAccount.mjs`.
import { createClient } from "@supabase/supabase-js";

const url = "http://127.0.0.1:54321";
const anonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";
const serviceRoleKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU";

const TEST_PASSWORD = "password123";
const ACCOUNTS = [
  { email: "alex@memora.test", displayName: "Alex" },
  { email: "sam@memora.test", displayName: "Sam" },
];

const admin = createClient(url, serviceRoleKey);

for (const account of ACCOUNTS) {
  const { error } = await admin.auth.admin.createUser({
    email: account.email,
    password: TEST_PASSWORD,
    email_confirm: true,
    user_metadata: { display_name: account.displayName },
  });

  if (error && !error.message.includes("already been registered")) {
    throw error;
  }

  console.log(
    error
      ? `Account already exists: ${account.email}`
      : `Created account: ${account.email}`,
  );
}

const clientA = createClient(url, anonKey);
const clientB = createClient(url, anonKey);

const { data: signInA, error: signInAErr } =
  await clientA.auth.signInWithPassword({
    email: ACCOUNTS[0].email,
    password: TEST_PASSWORD,
  });
if (signInAErr) throw signInAErr;

const { error: signInBErr } = await clientB.auth.signInWithPassword({
  email: ACCOUNTS[1].email,
  password: TEST_PASSWORD,
});
if (signInBErr) throw signInBErr;

const { data: existingSpace } = await clientA
  .from("couple_members")
  .select("couple_space_id")
  .eq("user_id", signInA.user.id)
  .maybeSingle();

if (existingSpace) {
  console.log("Test accounts are already paired into a couple space.");
} else {
  const { data: space, error: createErr } = await clientA.rpc(
    "create_couple_space",
    { p_name: "Alex & Sam" },
  );
  if (createErr) throw createErr;

  const { data: invite, error: inviteErr } = await clientA.rpc(
    "create_couple_invitation",
    { p_couple_space_id: space.id },
  );
  if (inviteErr) throw inviteErr;

  const { error: joinErr } = await clientB.rpc("join_couple_space", {
    p_code: invite.code,
  });
  if (joinErr) throw joinErr;

  console.log(`Paired accounts into couple space "${space.name}".`);
}

console.log("\nReady to log in with either account:");
for (const account of ACCOUNTS) {
  console.log(`  ${account.email} / ${TEST_PASSWORD}`);
}
