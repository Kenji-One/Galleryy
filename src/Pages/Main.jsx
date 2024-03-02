import Modal from "../Components/modal/Modal";

import "./main.css";

const Main = ({
  photos,
  photoStats,
  closeModal,
  openModal,
  selectedPhoto,
  handleSearchInput,
  loading,
  modalVisible,
}) => {
  return (
    <div className="main-div">
      <input
        className="search"
        type="text"
        placeholder="Search"
        onChange={handleSearchInput}
      />
      <div className="photos-container">
        {photos &&
          photos.map((photo) => (
            <img
              key={photo.id}
              src={photo.urls.small}
              alt={photo.description || "Photo"}
              onClick={() => openModal(photo)}
            />
          ))}
        {loading && (
          <div className="loading">
            <h1>Loading...</h1>
          </div>
        )}
      </div>

      <Modal
        visible={modalVisible}
        photo={selectedPhoto}
        photoStats={photoStats}
        closeModal={closeModal}
      />
    </div>
  );
};

export default Main;
