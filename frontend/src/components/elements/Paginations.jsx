import { Pagination } from "react-bootstrap";
const Paginations = ({
  currentPage,
  totalPages,
  onPageChange,
  totalRecords,
  isLoading,
}) => {
  const getPages = () => {
    const pages = [];
    const delta = 2; // Show 2 pages before and after currentPage

    let startPage = Math.max(2, currentPage - delta);
    let endPage = Math.min(totalPages - 1, currentPage + delta);

    // Always show first page
    pages.push(1);

    // Add ellipsis if startPage > 2
    if (startPage > 2) {
      pages.push("...");
    }

    // Middle page range
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis if endPage < totalPages - 1
    if (endPage < totalPages - 1) {
      pages.push("...");
    }

    // Always show last page if it's not already included
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };
  //   const getPages = () => {
  //   const pages = [];

  //   if (totalPages <= 5) {
  //     for (let i = 1; i <= totalPages; i++) {
  //       pages.push(i);
  //     }
  //   } else {
  //     // Always show first page
  //     pages.push(1);

  //     // Show left ellipsis if needed
  //     if (currentPage > 3) {
  //       pages.push("...");
  //     }

  //     // Show currentPage -1, currentPage, currentPage +1
  //     const startPage = Math.max(2, currentPage - 1);
  //     const endPage = Math.min(totalPages - 1, currentPage + 1);

  //     for (let i = startPage; i <= endPage; i++) {
  //       pages.push(i);
  //     }

  //     // Show right ellipsis if needed
  //     if (currentPage < totalPages - 2) {
  //       pages.push("...");
  //     }

  //     // Always show last page
  //     pages.push(totalPages);
  //   }

  //   return pages;
  // };
  // const getPages = () => {
  //   const pages = [];

  //   if (totalPages <= 5) {
  //     for (let i = 1; i <= totalPages; i++) {
  //       pages.push(i);
  //     }
  //   } else {
  //     pages.push(1);

  //     // 👇 Only add this part
  //     if (currentPage === 1) {
  //       pages.push(2);
  //       pages.push(3);
  //       pages.push("...");
  //       pages.push(totalPages);
  //       return pages;
  //     }

  //     if (currentPage > 3) {
  //       pages.push("...");
  //     }

  //     const startPage = Math.max(2, currentPage - 1);
  //     const endPage = Math.min(totalPages - 1, currentPage + 1);

  //     for (let i = startPage; i <= endPage; i++) {
  //       pages.push(i);
  //     }

  //     if (currentPage < totalPages - 2) {
  //       pages.push("...");
  //     }

  //     pages.push(totalPages);
  //   }

  //   return pages;
  // };

  return (
    <nav aria-label="Page navigation" className="pagination-style-4 mt-3">
      <Pagination className="pagination-style-4 mb-0 flex-wrap">
        <Pagination.Item
          disabled={currentPage === 1 || isLoading}
          onClick={() => !isLoading && onPageChange(currentPage - 1)}
        >
          Prev
        </Pagination.Item>

        {getPages().map((page, index) =>
          page === "..." ? (
            <Pagination.Item key={index} disabled>
              <i className="bi bi-three-dots"></i>
            </Pagination.Item>
          ) : (
            <Pagination.Item
              key={index}
              active={page === currentPage}
              onClick={() => onPageChange(page)}
            >
              {page}
            </Pagination.Item>
          )
        )}

        <Pagination.Item
          disabled={currentPage === totalPages || isLoading}
          onClick={() => !isLoading && onPageChange(currentPage + 1)}
        >
          Next
        </Pagination.Item>
      </Pagination>
    </nav>
  );
};

export default Paginations;
