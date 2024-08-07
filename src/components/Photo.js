import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

const Photo = ({ photo }) => {
  return (
    <div className="card rounded-4 shadow border-1 mx-2 my-4">
      <img
        src={photo.urls.regular}
        className="card-img-top rounded-top-4"
        alt={photo.alt_description}
      />
      <div className="card-body">
        <div className="d-flex justify-content-between align-content-center">
          <div className="d-flex align-content-center">
            <span className="text-start me-2">
              <img
                src={photo.user.profile_image.medium}
                className="rounded-circle"
                alt={photo.user.name}
                style={{ width: "30px", height: "30px" }}
              />
            </span>
            <p className="fs-6 truncate fw-medium">{photo.user.name}</p>
          </div>
          <div>
            <FontAwesomeIcon icon={faHeart} className="text-danger" />{" "}
            {photo.likes}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Photo;
