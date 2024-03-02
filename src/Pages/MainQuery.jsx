import React, { useEffect, useState, useCallback } from "react";
import Modal from "../Components/modal/Modal";

import "./main.css";

const Main = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [allPhotosLoaded, setAllPhotosLoaded] = useState(false);
  const [photoStats, setPhotoStats] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const openModal = (photo) => {
    console.log("photo:", photo);
    setSelectedPhoto(photo);
    fetchPhotoStats(photo.id);
    setModalVisible(true);
  };
  // Function to disable or enable body scroll
  const toggleBodyScroll = (disable) => {
    if (disable) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
  };

  useEffect(() => {
    // Call the function with true to disable scroll when modal is visible
    if (modalVisible) {
      toggleBodyScroll(true);
    } else {
      toggleBodyScroll(false);
    }

    // Cleanup function to enable scroll when component unmounts
    return () => toggleBodyScroll(false);
  }, [modalVisible]);
  const closeModal = () => {
    setSelectedPhoto(null);
    setModalVisible(false);
  };
  const fetchPhotoStats = (photoId) => {
    fetch(`https://api.unsplash.com/photos/${photoId}/statistics`, {
      headers: {
        Authorization: "Client-ID J1eMJytkUYok1kW5qMLrY2Vg7wNcqXZB0BsFAcitWdc",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to fetch photo statistics: ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((data) => {
        setPhotoStats(data);
      })
      .catch((error) => {
        console.error("Error fetching photo statistics:", error);
      });
  };
  // Function to fetch photos, with or without a query
  const fetchPhotos = useCallback(() => {
    if (allPhotosLoaded) return;
    const cacheKey = `photos-${query}-${page}`;
    const cachedData = localStorage.getItem(cacheKey);
    console.log("cacheKey:", cacheKey, "cachedData:", cachedData);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    setLoading(true);
    let url = `https://api.unsplash.com/photos?per_page=20&page=${page}&order_by=popular`;
    console.log("query1:", query);
    if (query && query.length > 2) {
      console.log("query2:", query);
      url = `https://api.unsplash.com/search/photos?query=${query}&page=${page}&per_page=20`;
    }

    fetch(url, {
      headers: {
        Authorization: "Client-ID J1eMJytkUYok1kW5qMLrY2Vg7wNcqXZB0BsFAcitWdc",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const newPhotos = query ? data.results : data;
        localStorage.setItem(cacheKey, JSON.stringify(newPhotos));
        if (newPhotos.length > 0) {
          setPhotos((prev) => [...prev, ...newPhotos]);
          setPage((prevPage) => prevPage + 1);
        } else {
          setAllPhotosLoaded(true);
        }
      })
      .catch((error) => console.error("Error fetching photos:", error))
      .finally(() => setLoading(false));
  }, [page, query, allPhotosLoaded]);

  useEffect(() => {
    fetchPhotos(); // Call initially and on query change
  }, []);

  // Debounce function setup
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Effect for handling search input changes with debouncing
  useEffect(() => {
    const handleSearch = debounce(() => {
      setPage(1);
      setPhotos([]);
      setAllPhotosLoaded(false);
      fetchPhotos();
    }, 500);
    handleSearch();
  }, [query]); // Dependency on query to trigger debounced fetch

  const handleSearchInput = (event) => {
    setQuery(event.target.value);
  };

  // Effect for infinite scrolling
  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.offsetHeight - 100;
      if (nearBottom && !loading && !allPhotosLoaded) {
        fetchPhotos();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, fetchPhotos, allPhotosLoaded]);

  return (
    <div className="main-div">
      <input
        className="search"
        type="text"
        placeholder="Search"
        onChange={handleSearchInput}
      />
      <div className="photos-container">
        {photos.map((photo) => (
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
