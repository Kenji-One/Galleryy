import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import History from './Pages/History';
import Header from './Components/header/Header';
import Main from './Pages/Main';

const App = () => {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
