const SearchWithDropdown = ({
  searchOption,
  selectedFilter,
  setSelectedFilter,
  search,
  setSearch,
  setCurrentPage,
}) => {
  return (
    <>
      <div className="search-box position-relative d-flex align-items-center">
        <input
          type="text"
          className="form-control search-input rounded-pill"
          placeholder={`Search ${selectedFilter.label.toLowerCase()}...`}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        <div className="dropdown position-absolute end-0 me-2">
          <button
            className="btn dropdown-toggle search-dd-btn"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {selectedFilter.label}
          </button>

          <ul className="dropdown-menu dropdown-menu-end">
            {searchOption.map((option) => (
              <li key={option.value}>
                <button
                  className={`dropdown-item ${
                    selectedFilter.value === option.value ? "active" : ""
                  }`}
                  onClick={() => setSelectedFilter(option)}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <i className="bi bi-search position-absolute search-icon" />
      </div>
    </>
  );
};

export default SearchWithDropdown;
