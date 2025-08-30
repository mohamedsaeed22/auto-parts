import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Pagination } from "./pagination";

describe("Pagination Component", () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  it("renders pagination with correct page numbers", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        totalItems={50}
        itemsPerPage={10}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("shows correct info text", () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        totalItems={50}
        itemsPerPage={10}
        onPageChange={mockOnPageChange}
        showInfo={true}
      />
    );

    expect(
      screen.getByText("Showing 11 to 20 of 50 results")
    ).toBeInTheDocument();
  });

  it("calls onPageChange when page is clicked", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        totalItems={50}
        itemsPerPage={10}
        onPageChange={mockOnPageChange}
      />
    );

    fireEvent.click(screen.getByText("2"));
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it("disables previous button on first page", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        totalItems={50}
        itemsPerPage={10}
        onPageChange={mockOnPageChange}
      />
    );

    const prevButton = screen.getByLabelText("Go to previous page");
    expect(prevButton).toBeDisabled();
  });

  it("disables next button on last page", () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        totalItems={50}
        itemsPerPage={10}
        onPageChange={mockOnPageChange}
      />
    );

    const nextButton = screen.getByLabelText("Go to next page");
    expect(nextButton).toBeDisabled();
  });

  it("shows ellipsis for large page counts", () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        totalItems={100}
        itemsPerPage={10}
        onPageChange={mockOnPageChange}
        maxVisiblePages={5}
      />
    );

    // Should show ellipsis when there are many pages
    const ellipsisElements = screen.getAllByText("...");
    expect(ellipsisElements.length).toBeGreaterThan(0);
  });
});
