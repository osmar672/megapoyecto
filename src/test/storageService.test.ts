import { describe, expect, it } from "vitest";
import { localStorageService } from "../core/storage/storageService";

describe("storageService", () => {
  it("recupera el valor predeterminado y elimina JSON inválido", () => {
    localStorage.setItem("corrupt", "{dato roto");
    const result = localStorageService.get("corrupt", [{ id: "fallback" }]);
    expect(result.value).toEqual([{ id: "fallback" }]);
    expect(result.recovered).toBe(true);
    expect(localStorage.getItem("corrupt")).toBeNull();
  });
});
