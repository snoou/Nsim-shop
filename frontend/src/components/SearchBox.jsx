import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi'; // همون پکیج آیکونی که در هدر استفاده کردیم

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();

  const [keyword, setKeyword] = useState(urlKeyword || '');

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword.trim()}`);
      setKeyword('');
    } else {
      navigate('/');
    }
  };

  return (
    <Form onSubmit={submitHandler} className='d-flex position-relative align-items-center' style={{ minWidth: '300px' }}>
      <Form.Control
        type='text'
        name='q'
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder='جستجو در محصولات...'
        className='search-input shadow-none'
      />
      
      {/* دکمه تبدیل به یک آیکون شیشه‌ای روی اینپوت شده */}
      <Button 
        type='submit' 
        variant='link' 
        className='search-btn p-0 text-muted'
        title="جستجو"
      >
        <FiSearch size={18} />
      </Button>
    </Form>
  );
};

export default SearchBox;