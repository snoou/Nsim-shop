import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiArrowRight, FiUploadCloud, FiImage, FiLayers, FiTag, FiDollarSign, FiBox } from 'react-icons/fi';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { useFetchCategoriesQuery } from '../../slices/categoryApiSlice';
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from '../../slices/productsApiSlice';
import '../../assets/styles/ProductEditScreen.css';

const ProductEditScreen = () => {
  const { id: productId } = useParams();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const { data: categories, isLoading: loadingCategories } = useFetchCategoriesQuery();
  const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();
  const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
      setIsFeatured(product.isFeatured || false);
    }
  }, [product]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        productId,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
        isFeatured
      }).unwrap();
      toast.success('محصول با موفقیت ویرایش شد');
      refetch();
      navigate('/admin/productlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="admin-dashboard-wrapper">
      <div className="admin-container">

        <div className="admin-header-flex">
          <div>
            <h1 className="admin-page-title">ویرایش محصول</h1>
            <p className="admin-page-subtitle">مشخصات محصول را بررسی و به‌روزرسانی کنید</p>
          </div>
          <Link to='/admin/productlist' className="btn-back-minimal">
            بازگشت <FiArrowRight size={18} />
          </Link>
        </div>

        {loadingUpdate && <Loader />}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error.data?.message || error.error}</Message>
        ) : (
          <form onSubmit={submitHandler} className="edit-product-form">
            <div className="edit-grid-layout">

              <div className="edit-sidebar">
                <div className="admin-card text-center">
                  <h3 className="card-section-title mb-4">تصویر محصول</h3>

                  <div className="image-preview-area">
                    {image ? (
                      <img src={image} alt="پیش‌نمایش محصول" className="preview-img" />
                    ) : (
                      <div className="empty-image-placeholder">
                        <FiImage size={48} className="text-muted mb-2" />
                        <span>تصویری انتخاب نشده</span>
                      </div>
                    )}
                  </div>

                  <div className="upload-btn-wrapper">
                    <label className="btn-upload-luxury">
                      {loadingUpload ? (
                        'در حال آپلود...'
                      ) : (
                        <>
                          <FiUploadCloud size={20} />
                          بارگذاری تصویر جدید
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
                  <h3 className="card-section-title mb-4">اطلاعات پایه</h3>

                  <div className="minimal-input-group mb-4">
                    <label>نام کامل محصول</label>
                    <input
                      type="text"
                      placeholder="مثلاً: پیراهن مردانه مدل کلاسیک"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="minimal-input"
                      required
                    />
                  </div>

                  <div className="form-row-2col mb-4">
                    <div className="form-group">
                      <label htmlFor="category" className="form-label">دسته‌بندی</label>

                      {loadingCategories ? (
                        <p>در حال بارگذاری دسته‌بندی‌ها...</p>
                      ) : (
                        <select
                          id="category"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="form-control"
                        >
                          <option value="">یک دسته‌بندی انتخاب کنید...</option>
                          {categories?.map((c) => (
                            <option key={c._id} value={c.slug}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    {/* برند */}
                    <div className="minimal-input-group">
                      <label><FiLayers className="icon-label" /> برند</label>
                      <input
                        type="text"
                        placeholder="نام برند یا تولیدکننده"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="minimal-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row-2col mb-4">
                    {/* قیمت */}
                    <div className="minimal-input-group">
                      <label><FiDollarSign className="icon-label" /> قیمت فروش (تومان)</label>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="minimal-input"
                        required
                      />
                    </div>
                    {/* موجودی */}
                    <div className="minimal-input-group">
                      <label><FiBox className="icon-label" /> موجودی انبار (عدد)</label>
                      <input
                        type="number"
                        value={countInStock}
                        onChange={(e) => setCountInStock(e.target.value)}
                        className="minimal-input"
                        required
                      />
                    </div>
                  </div>

                  {/* توضیحات */}
                  <div className="minimal-input-group mb-4">
                    <label>توضیحات تکمیلی</label>
                    <textarea
                      rows="5"
                      placeholder="ویژگی‌ها، جنس، سایزبندی و جزئیات محصول..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="minimal-input"
                      required
                    ></textarea>
                  </div>

                  {/* ---------------------------------------------------- */}
                  {/* چک‌باکس محصول ویژه (با طراحی اختصاصی متناسب با فرم شما) */}
                  {/* ---------------------------------------------------- */}
                  <div className="minimal-input-group mb-4" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    backgroundColor: 'var(--bg-main, #f9fafb)',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light, #e5e7eb)'
                  }}>
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      style={{
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer',
                        accentColor: 'var(--primary, #0D9488)' // رنگ سبز کله‌غازی شما
                      }}
                    />
                    <label htmlFor="isFeatured" style={{
                      margin: 0,
                      cursor: 'pointer',
                      fontWeight: '600',
                      color: 'var(--text-dark, #111827)'
                    }}>
                      نمایش این محصول در ویترین صفحه اصلی (محصولات ویژه)
                    </label>
                  </div>

                  {/* دکمه ثبت */}
                  <div className="form-action-footer">
                    <button
                      type="submit"
                      className="btn-submit-solid"
                      disabled={loadingUpdate || loadingUpload}
                    >
                      <FiSave size={20} />
                      {loadingUpdate ? 'در حال ذخیره‌سازی...' : 'ذخیره تغییرات محصول'}
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

export default ProductEditScreen;