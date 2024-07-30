import { render, screen } from "@testing-library/react";
import { Loading } from ".";

describe("Loading", () => {
  it("should render the Loading container", () => {
    render(<Loading />);
    const loadingContainer = screen.getByTestId("loading-container");
    expect(loadingContainer).toBeInTheDocument();
    expect(loadingContainer).toHaveClass("MuiBox-root");
  });

  it("should render the CircularProgress component", () => {
    render(<Loading />);
    const circularProgress = screen.getByTestId("circular-progress");
    expect(circularProgress).toBeInTheDocument();
    expect(circularProgress).toHaveClass("MuiCircularProgress-root");
  });
});
