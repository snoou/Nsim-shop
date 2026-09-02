import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import {
  useGetCategoryDetailsQuery,
  useUpdateCategoryMutation,
  useUploadCategoryImageMutation,
} from '../../slices/categoryApiSlice';
import '../../assets/styles/AdminCategory.css'; 

const CategoryEditScreen = () => {
  const { id: categoryId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState(''); // استیت جدید برای اسلاگ
  const [image, setImage] = useState('');

  const { data: category, isLoading, error, refetch } = useGetCategoryDetailsQuery(categoryId);
  const [updateCategory, { isLoading: loadingUpdate }] = useUpdateCategoryMutation();
  const [uploadCategoryImage, { isLoading: loadingUpload }] = useUploadCategoryImageMutation();

  useEffect(() => {
    if (category) {
      setName(category.name);
      setSlug(category.slug || ''); // مقداردهی اولیه اسلاگ از دیتابیس
      setImage(category.image);
    }
  }, [category]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateCategory({ categoryId, name, slug, image }).unwrap();
      toast.success('دسته‌بندی با موفقیت بروزرسانی شد');
      refetch();
      navigate('/admin/categorylist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadCategoryImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="admin-container">
      <Link to="/admin/categorylist" className="admin-btn admin-btn-back">
        بازگشت
      </Link>

      <div className="form-card">
        <h1 className="admin-title" style={{ marginBottom: '24px' }}>ویرایش دسته‌بندی</h1>
        
        {loadingUpdate && <Loader />}
        
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error?.data?.message || error.error}</Message>
        ) : (
          <form onSubmit={submitHandler}>
            
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                نام دسته‌بندی (فارسی)
              </label>
              <input
                type="text"
                id="name"
                placeholder="مثال: شال و روسری"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="slug" className="form-label">
                اسلاگ (نام انگلیسی برای URL)
              </label>
              <input
                type="text"
                id="slug"
                placeholder="مثال: scarf"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="form-control"
                dir="ltr" 
              />
            </div>

            <div className="form-group">
              <label htmlFor="image" className="form-label">
                تصویر دسته‌بندی
              </label>
              
              <input
                type="text"
                id="image"
                placeholder="آدرس تصویر (URL)"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="form-control"
                dir="ltr"
              />
              
              <input
                type="file"
                id="image-file"
                onChange={uploadFileHandler}
                className="form-control form-file-input"
              />
              {loadingUpload && <Loader />}
            </div>

            <button type="submit" className="admin-btn admin-btn-primary btn-submit">
              بروزرسانی اطلاعات
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CategoryEditScreen;