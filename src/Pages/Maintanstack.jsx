import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Modal from "../Components/modal/Modal";
import "./main.css";

const fetchPhotos = async ({ page, query }) => {
  let url = `https://api.unsplash.com/photos?per_page=20&page=${page}&order_by=popular`;
  if (query && query.length > 2) {
    url = `https://api.unsplash.com/search/photos?query=${query}&page=${page}&per_page=20`;
  }
  const response = await fetch(url, {
    headers: {
      Authorization: "Client-ID J1eMJytkUYok1kW5qMLrY2Vg7wNcqXZB0BsFAcitWdc",
    },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok.");
  }
  const data = await response.json();
  return query ? data.results : data;
};

const Main = () => {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const {
    data: photos,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["photos", { page, query }],
    queryFn: () => fetchPhotos({ page, query }),
    keepPreviousData: true,
  });
  // Function to open modal with photo details
  const openModal = (photo) => {
    setSelectedPhoto(photo);
    setModalVisible(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedPhoto(null);
    setModalVisible(false);
  };

  // Handle search input changes
  const handleSearchInput = (event) => {
    setQuery(event.target.value);
    setPage(1); // Reset to the first page for new searches
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight
      ) {
        setPage((oldPage) => oldPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Render the component UI
  return (
    <div className="main-div">
      <input
        className="search"
        type="text"
        placeholder="Search"
        value={query}
        onChange={handleSearchInput}
      />
      <div className="photos-container">
        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : isError ? (
          <div>Error: {error?.message}</div>
        ) : (
          photos?.map((photo) => (
            <img
              key={photo.id}
              src={photo.urls.small}
              alt={photo.description || "Photo"}
              onClick={() => openModal(photo)}
            />
          ))
        )}
      </div>
      {modalVisible && selectedPhoto && (
        <Modal
          visible={modalVisible}
          photo={selectedPhoto}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default Main;
