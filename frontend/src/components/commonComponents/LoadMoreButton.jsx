import { Button } from "react-bootstrap";

const LoadMoreButton = ({ isLoading, loadedRecords, totalRecords, onLoadMore }) => {
  return (
    <>
      {isLoading && (
        <div className="d-flex justify-content-center my-4">
          <div
            className="spinner-border text-primary"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {!isLoading && totalRecords > 0 && loadedRecords < totalRecords && (
        <div className="d-flex justify-content-center my-4">
          <Button
            variant="primary"
            className="custom-select-height px-4 py-2"
            onClick={onLoadMore}
          >
            Show More
          </Button>
        </div>
      )}
    </>
  );
};

export default LoadMoreButton;