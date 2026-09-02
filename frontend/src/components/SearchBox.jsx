import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import '../assets/styles/SearchBox.css';

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();

  const [keyword, setKeyword] = useState(urlKeyword || '');

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword.trim()}`);
    } else {
      navigate('/');
    }
  };

  return (
    <form onSubmit={submitHandler} className="luxury-search-form">
      <input
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder="جستجوی لباس، اکسسوری، ..."
        className="luxury-search-input"
        autoComplete="off"
      />
      
      <button type="submit" className="luxury-search-btn" aria-label="جستجو">
        <FiSearch size={20} />
      </button>
    </form>
  );
};

export default SearchBox;