import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiArrowRight, FiImage, FiUploadCloud, FiSave, FiType, FiLink } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { useGetPostersQuery, useUpdatePosterMutation } from '../../slices/postersApiSlice';
import { useUploadProductImageMutation } from '../../slices/productsApiSlice'; 

const PosterEditScreen = () => {
  const { id: posterId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [link, setLink] = useState('');

  const { data: posters, isLoading, error } = useGetPostersQuery();
  const poster = posters?.find((p) => p._id === posterId);

  const [updatePoster, { isLoading: loadingUpdate }] = useUpdatePosterMutation();
  const [uploadImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();

  useEffect(() => {
    if (poster) {
      setTitle(poster.title);
      setImage(poster.image);
      setLink(poster.link || '');
    }
  }, [poster]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updatePoster({
        posterId,
        title,
        image,
        link,
      }).unwrap();
      toast.success('پوستر با موفقیت آپدیت شد');
      navigate('/admin/posterlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="admin-dashboard-wrapper">
      <div className="admin-container">
        
        {/* هدر صفحه ویرایش */}
        <div className="admin-header-flex">
          <div>
            <h1 className="admin-page-title">ویرایش پوستر</h1>
            <p className="admin-page-subtitle">مشخصات بنر صفحه اصلی را ویرایش کنید</p>
          </div>
          <Link to='/admin/posterlist' className="btn-back-minimal">
            بازگشت <FiArrowRight size={18} />
          </Link>
        </div>

        {loadingUpdate && <Loader />}
        
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error?.data?.message || error.error}</Message>
        ) : (
          <form onSubmit={submitHandler} className="edit-product-form">
            <div className="edit-grid-layout">
              
              {/* ستون راست: مدیریت تصویر */}
              <div className="edit-sidebar">
                <div className="admin-card text-center">
                  <h3 className="card-section-title mb-4">تصویر پوستر</h3>
                  
                  {/* پیش‌نمایش تصویر (با نسبت ابعاد مستطیلی برای بنر) */}
                  <div className="image-preview-area" style={{ aspectRatio: '16/9' }}>
                    {image ? (
                      <img src={image} alt="پیش‌نمایش پوستر" className="preview-img" style={{ objectFit: 'cover' }} />
                    ) : (
                      <div className="empty-image-placeholder">
                        <FiImage size={48} className="text-muted mb-2" />
                        <span>تصویری انتخاب نشده</span>
                      </div>
                    )}
                  </div>

                  {/* دکمه آپلود فایل */}
                  <div className="upload-btn-wrapper">
                    <label className="btn-upload-luxury">
                      {loadingUpload ? (
                        'در حال آپلود...'
                      ) : (
                        <>
                          <FiUploadCloud size={20} />
                          بارگذاری تصویر بنر
                        </>
                      )}
                      <input
                        type="file"
                        onChange={uploadFileHandler}
                        className="hidden-file-input"
                      />
                    </label>
                  </div>

                  <div className="minimal-input-group mt-4 text-right">
                    <label>آدرس تصویر (URL)</label>
                    <input
                      type="text"
                      placeholder="لینک مستقیم تصویر..."
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="minimal-input ltr-align text-muted"
                    />
                  </div>
                </div>
              </div>

              <div className="edit-main-content">
                <div className="admin-card">
                  <h3 className="card-section-title mb-4">اطلاعات پوستر</h3>
                  
                  <div className="minimal-input-group mb-4">
                    <label><FiType className="icon-label" /> عنوان پوستر</label>
                    <input
                      type="text"
                      placeholder="مثلاً: کالکشن پاییزه"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="minimal-input"
                      required
                    />
                  </div>

                  <div className="minimal-input-group mb-4">
                    <label><FiLink className="icon-label" /> لینک هدایت (URL)</label>
                    <input
                      type="text"
                      placeholder="مثلاً: /fashion/sale"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      className="minimal-input ltr-align"
                    />
                    <small style={{ color: '#6b7280', fontSize: '12px', marginTop: '8px', display: 'block' }}>
                      وقتی کاربر روی این بنر کلیک کرد، به کدام صفحه برود؟
                    </small>
                  </div>

                  <div className="form-action-footer" style={{ marginTop: '40px' }}>
                    <button 
                      type="submit" 
                      className="btn-submit-solid"
                      disabled={loadingUpdate || loadingUpload}
                    >
                      <FiSave size={20} />
                      {loadingUpdate ? 'در حال ذخیره‌سازی...' : 'ذخیره تغییرات پوستر'}
                    </button>
                  </div>

                </div>
              </div>
              
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PosterEditScreen;