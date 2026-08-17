import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AuthProvider, useAuth } from "../features/auth/context/AuthContext";

vi.mock("../core/data/seedService", () => ({
  initializeSeedData: vi.fn().mockRejectedValue(new Error("storage unavailable")),
}));

function AuthStatus() {
  const { isLoading, initializationError } = useAuth();
  return <p role="status">{isLoading ? "Cargando" : initializationError ?? "Listo"}</p>;
}

describe("AuthProvider", () => {
  afterEach(() => vi.restoreAllMocks());

  it("sale del estado de carga y comunica un error de inicialización", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    render(<AuthProvider><AuthStatus /></AuthProvider>);

    expect(screen.getByRole("status")).toHaveTextContent("Cargando");
    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent("No fue posible preparar");
    });
  });
});
