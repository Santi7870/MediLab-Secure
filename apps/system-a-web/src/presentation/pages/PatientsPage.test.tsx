import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PatientsPage } from "./PatientsPage";

vi.mock("../auth/AuthContext", () => ({
  useAuth: () => ({
    getAccessToken: async () => "fake-token"
  })
}));

describe("PatientsPage", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders patient data after a successful request", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify([
          { id: 1, full_name: "Ana Perez", document_number: "1712345678" }
        ]),
        { status: 200 }
      )
    );

    render(
      <BrowserRouter>
        <PatientsPage />
      </BrowserRouter>
    );

    await waitFor(() => expect(screen.getByText("Ana Perez")).toBeInTheDocument());
    expect(screen.getByText("1712345678")).toBeInTheDocument();
  });

  it("renders the error state when the request fails", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response("", { status: 500 }));

    render(
      <BrowserRouter>
        <PatientsPage />
      </BrowserRouter>
    );

    await waitFor(() =>
      expect(screen.getByText("Unable to load patients.")).toBeInTheDocument()
    );
  });
});
