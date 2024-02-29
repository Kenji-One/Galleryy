import React from 'react';


const Modal = ({ visible, photo, photoStats, closeModal }) => {
  if (!visible) return null; // If modal is not visible, return null

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>&times;</span>
        <img src={photo.urls.regular} alt={photo.alt_description} />
        <div className='description'>Likes: {photo.likes}</div>
        <div className='description'>Downloads: {photoStats ? photoStats.downloads.total : 'Loading...'}</div>
        <div className='description'>Views: {photoStats ? photoStats.views.total : 'Loading...'}</div>
      </div>
    </div>
  );
}
export default Modal;
