import React, { useEffect, useState } from 'react';
import "./main.css";

const Main = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allPhotosLoaded, setAllPhotosLoaded] = useState(false);

  useEffect(() => {
    fetch('https://api.unsplash.com/photos?per_page=20&order_by=popular', {
      headers: {
        Authorization: 'Client-ID b4MDr_yKspf0wxNzoqB7AvziYfyjNUypHFNQSexGaVE'
      }
    })
    .then(response => response.json())
    .then(data => {
      
      setPhotos(data); 
    })
    .catch(error => {
      console.error('Error fetching photos:', error);
    })
    .finally(() => {
      setLoading(false); 
    });
  }, []);

  useEffect(() => {
    // Check if all photos have been loaded
    if (!loading && photos.length > 0 && photos.every(photo => !photo.loading)) {
      setAllPhotosLoaded(true);
    }
  }, [loading, photos]);

  return (
    <div className='main-div'>
      <input className='search'
        type="text"
        placeholder='Search'/>
      <div className="photos-container">
        {allPhotosLoaded && 
          photos.map(photo => (
            <img key={photo.id} src={photo.urls.small} alt={photo.alt_description} />
          ))
        }
        {loading && !allPhotosLoaded && (
          <div className='loading'><h1>Loading...</h1></div>
        )}
      </div>
    </div>
  );
}

export default Main;
