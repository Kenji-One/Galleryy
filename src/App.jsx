import { useEffect, useState, useCallback } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import History from "./Pages/History";
import Header from "./Components/header/Header";
import Main from "./Pages/Main";

const App = () => {
  const [searchHistory, setSearchHistory] = useState(() => {
    // Retrieve history from local storage or set to an empty array if none
    const history = localStorage.getItem("searchHistory");
    return history ? JSON.parse(history) : [];
  });
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [allPhotosLoaded, setAllPhotosLoaded] = useState(false);
  const [photoStats, setPhotoStats] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isHistoryVisible, setHistoryVisible] = useState(false);
  console.log(searchHistory);
  const openModal = (photo) => {
    // console.log("photo:", photo);
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

    try {
      if (cachedData !== null) {
        const parsedData = JSON.parse(cachedData);
        // Assuming setPhotos is a function to update your state with the cached photos
        setPhotos(parsedData);
        setPage((prevPage) => prevPage + 1);
        return; // Stop execution as cached data is used
      }
    } catch (error) {
      console.error("Error parsing cached photos:", error);
      // Optionally handle corrupted data, e.g., remove the corrupted item
      localStorage.removeItem(cacheKey);
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
    const newQuery = event.target.value;
    setTimeout(() => {
      if (newQuery.length > 2) {
        setQuery(newQuery);

        // Update search history if the query is not empty and not already included
        if (newQuery.trim() && !searchHistory.includes(newQuery)) {
          const updatedHistory = [...searchHistory, newQuery];
          setSearchHistory(updatedHistory);
          localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
        }
      }
    }, 850);
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
  const onHistoryItemClick = (query) => {
    setHistoryVisible(true);
    setQuery(query);
  };
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <Main
                photos={photos}
                photoStats={photoStats}
                closeModal={closeModal}
                openModal={openModal}
                selectedPhoto={selectedPhoto}
                handleSearchInput={handleSearchInput}
                loading={loading}
                modalVisible={modalVisible}
              />
            }
          />
          <Route
            path="/history"
            element={
              <History
                photos={photos}
                photoStats={photoStats}
                closeModal={closeModal}
                openModal={openModal}
                selectedPhoto={selectedPhoto}
                loading={loading}
                modalVisible={modalVisible}
                searchHistory={searchHistory}
                onHistoryItemClick={onHistoryItemClick}
                isHistoryVisible={isHistoryVisible}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
