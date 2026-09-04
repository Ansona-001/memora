import type { Tables, TablesInsert, TablesUpdate } from "@/types/database";

export type Album = Tables<"albums">;
export type AlbumInsert = TablesInsert<"albums">;
export type AlbumUpdate = TablesUpdate<"albums">;
