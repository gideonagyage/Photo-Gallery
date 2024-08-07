import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Spinner from "react-bootstrap/Spinner";
import Photo from "./Photo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Masonry from "react-masonry-css";
import Modal from "react-bootstrap/Modal";


function PhotoGallery() {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const api_Key = process.env.REACT_APP_KEY;

  const fetchPhotos = async (query = "Code", page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.unsplash.com/search/photos?client_id=${api_Key}&query=${query}&page=${page}&per_page=20`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch photos");
      }

      const data = await response.json();
      setPhotos(data.results);
      setTotalPages(Math.ceil(data.total / 20));
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos("Code", 1);
  }, []);

  const handleSearch = async () => {
    if (searchTerm.trim() === "") {
      // Show the modal if the search field is empty
      setShowModal(true);
    } else {
      setCurrentPage(1);
      fetchPhotos(searchTerm, 1);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (searchTerm.length < 1) {
      fetchPhotos("Code", page);
    } else {
      fetchPhotos(searchTerm, page);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  // Predefined Search Buttons
  const handlePredefinedSearch = async (query) => {
    setCurrentPage(1);
    fetchPhotos(query, 1);
    setSearchTerm(query);
  };
  
  const handleCloseModal = () => setShowModal(false);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" size="6x" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <p className="text-danger fw-bold fs-3">
          An error occured, please refresh and try again.
        </p>
      </div>
    );
  }
  // Pagination Logic
  const startPage = Math.max(1, currentPage - 1);
  const endPage = Math.min(totalPages, currentPage + 1);

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  return (
    <div className="container">
      {/* Search Field */}
      <div className="row my-4 d-flex justify-content-center align-items-center search">
        <div className="input-group col-sm-12 col-xs-8 text-center d-flex justify-content-center flex-wrap">
          <input
            type="text"
            className="search-input fw-medium"
            placeholder="Search for photos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <div className="input-group-append">
            <button className="search-btn" onClick={handleSearch}>
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </div>
      </div>

      {/* Predefined Search Buttons */}
      <div className="row mt-3 mb-2 d-flex justify-content-center align-items-center">
        <div className="col-sm-12 col-xs-8 text-center d-flex justify-content-center flex-wrap">
          <button
            className="btn-pd-search shadow me-2 mb-3"
            onClick={() => handlePredefinedSearch("nature")}
          >
            Nature
          </button>
          <button
            className="btn-pd-search shadow me-2 mb-3"
            onClick={() => handlePredefinedSearch("technology")}
          >
            Technology
          </button>
          <button
            className="btn-pd-search shadow me-2 mb-3"
            onClick={() => handlePredefinedSearch("art")}
          >
            Art
          </button>
          <button
            className="btn-pd-search shadow me-2 mb-3"
            onClick={() => handlePredefinedSearch("food")}
          >
            Food
          </button>
          <button
            className="btn-pd-search shadow me-2 mb-3"
            onClick={() => handlePredefinedSearch("fashion")}
          >
            Fashion
          </button>
        </div>
      </div>

      {/* Display images in Masonry Grid */}
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {photos.map((photo) => (
          <div key={photo.id} className="masonry-item">
            <Photo photo={photo} />
          </div>
        ))}
      </Masonry>

      {/* Pagination */}
      <nav className="mt-4 d-flex justify-content-center mb-4">
        <ul className="pagination justify-content-center">
          {/* Previous Button */}
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link rounded-start-5 me-2"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
          </li>

          {/* Pages In Between */}
          {Array.from(
            { length: endPage - startPage + 1 },
            (_, index) => startPage + index
          ).map((page) => (
            <li
              key={page}
              className={`page-item mx-2 ${
                currentPage === page ? "active" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            </li>
          ))}
          {/* Next Button */}
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link rounded-end-5 ms-2"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>

      {/* Modal for Empty Search */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Body className="text-black text-center fs-4 fw-semibold pt-3">
          Search field cannot be empty.
        </Modal.Body>

        <div className="text-center">
          <button
            variant="danger"
            className="rounded-4 fw-bold fs-5 px-3 mb-3 btn-close-pop"
            onClick={handleCloseModal}
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default PhotoGallery;
