export function Pagination({
  currentPage,
  setCurrentPage,
  totalPages,
}) {

  const pagesPerGroup = 5;

  const currentGroup = Math.ceil(currentPage / pagesPerGroup);

  const startPage = (currentGroup - 1) * pagesPerGroup + 1;

  const endPage = Math.min(
    startPage + pagesPerGroup - 1,
    totalPages
  );

  const pageNumbers = [];

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">

      {/* Previous Group */}
      <button
        disabled={startPage === 1}
        onClick={() =>
          setCurrentPage(startPage - pagesPerGroup)
        }
      >
        Prev
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          className={
            currentPage === page
              ? "active-page"
              : ""
          }
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </button>
      ))}

      {/* Next Group */}
      <button
        disabled={endPage === totalPages}
        onClick={() =>
          setCurrentPage(endPage + 1)
        }
      >
        Next
      </button>

    </div>
  );
}