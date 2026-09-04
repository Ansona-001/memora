import "@testing-library/jest-dom/vitest";

// jsdom does not implement the Blob URL APIs; upload code relies on them
// for local previews, so stub them out for the test environment.
if (!URL.createObjectURL) {
  URL.createObjectURL = () => "blob:mock-url";
}
if (!URL.revokeObjectURL) {
  URL.revokeObjectURL = () => undefined;
}
