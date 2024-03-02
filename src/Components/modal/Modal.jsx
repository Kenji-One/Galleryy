import React from "react";
import "./modal.css";
const Modal = ({ visible, photo, photoStats, closeModal }) => {
  console.log("Modal render, visible:", visible);
  if (!visible) return null; // If modal is not visible, return null

  return (
    <div className="modal">
      <div className="modal-back" onClick={closeModal}></div>
      <div className="modal-content">
        <span className="close" onClick={closeModal}>
          &times;
        </span>
        <img src={photo.urls.regular} alt={photo.alt_description} />
        <div className="description">Likes: {photo.likes}</div>
        <div className="description">
          Downloads: {photoStats ? photoStats.downloads.total : "Loading..."}
        </div>
        <div className="description">
          Views: {photoStats ? photoStats.views.total : "Loading..."}
        </div>
      </div>
    </div>
  );
};

export default Modal;
