import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LabResultsPage } from "./LabResultsPage";

vi.mock("../auth/AuthContext", () => ({
  useAuth: () => ({
    getAccessToken: async () => "fake-token"
  })
}));

describe("LabResultsPage", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders laboratory results after a successful request", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify([
          {
            id: 1,
            patient_id: 1,
            test_name: "Glucose",
            result_value: "98",
            unit: "mg/dL",
            reference_range: "70-100",
            status: "Normal",
            collected_at: "2026-06-18T12:00:00Z"
          }
        ]),
        { status: 200 }
      )
    );

    render(
      <MemoryRouter initialEntries={["/patients/1/lab-results"]}>
        <Routes>
          <Route element={<LabResultsPage />} path="/patients/:patientId/lab-results" />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("Glucose")).toBeInTheDocument());
    expect(screen.getByText("98")).toBeInTheDocument();
  });
});
