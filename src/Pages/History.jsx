// History.jsx
import Modal from "../Components/modal/Modal";
import "./history.css";

const History = ({
  searchHistory,
  onHistoryItemClick,
  photos,
  photoStats,
  closeModal,
  openModal,
  selectedPhoto,
  loading,
  modalVisible,
  isHistoryVisible,
}) => {
  return (
    <div className="history-container">
      <div className="history-list-container">
        <ul className="history-list">
          {searchHistory.map((item, index) => (
            <li
              key={index}
              className="history-item"
              onClick={() => onHistoryItemClick(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="photos-container">
        {photos &&
          isHistoryVisible &&
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

export default History;
