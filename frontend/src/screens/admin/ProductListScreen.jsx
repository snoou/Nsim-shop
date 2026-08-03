import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiEdit3, FiTrash2, FiPlus, FiLayers, FiTag, FiImage, FiSearch, FiFilter } from 'react-icons/fi';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useCreateProductMutation,
} from '../../slices/productsApiSlice';
import { toast } from 'react-toastify';
import '../../assets/styles/ProductListScreen.css'; 

const ProductListScreen = () => {
  const { pageNumber } = useParams();

  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
  });

  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();
  const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();

  // --- استیت‌های مربوط به فیلتر و جستجو ---
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // استخراج دسته‌بندی‌های یکتا برای منوی کشویی فیلتر
  const uniqueCategories = useMemo(() => {
    if (!data?.products) return [];
    return [...new Set(data.products.map(product => product.category))];
  }, [data]);

  // --- منطق فیلتر و مرتب‌سازی (نمایش جدیدترین‌ها در ابتدا) ---
  const displayedProducts = useMemo(() => {
    if (!data?.products) return [];
    
    let filtered = data.products.filter((product) => {
      // جستجو در نام و برند
      const matchSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase());
      
      // فیلتر دسته‌بندی
      const matchCategory = categoryFilter === 'all' || product.category === categoryFilter;
      
      return matchSearch && matchCategory;
    });

    // مرتب‌سازی: جدیدترین‌ها در ابتدا (بر اساس شناسه MongoDB که حاوی تایم‌استمپ است)
    return filtered.sort((a, b) => b._id.localeCompare(a._id));
  }, [data, searchTerm, categoryFilter]);


  const deleteHandler = async (id) => {
    if (window.confirm('آیا از حذف این محصول اطمینان دارید؟ این عملیات غیرقابل بازگشت است.')) {
      try {
        await deleteProduct(id);
        refetch();
        toast.success('محصول با موفقیت حذف شد');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const createProductHandler = async () => {
    if (window.confirm('آیا می‌خواهید یک محصول جدید با مقادیر پیش‌فرض ایجاد کنید؟')) {
      try {
        await createProduct();
        refetch();
        toast.success('محصول جدید ایجاد شد، لطفاً آن را ویرایش کنید');
        // به صورت خودکار به اول لیست می‌آید چون مرتب‌سازی نزولی است
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="admin-dashboard-wrapper">
      <div className="admin-container">
        
        {/* هدر صفحه */}
        <div className="admin-header-flex">
          <div>
            <h1 className="admin-page-title">کاتالوگ محصولات</h1>
            <p className="admin-page-subtitle">مدیریت موجودی، قیمت‌ها و افزودن محصول جدید</p>
          </div>
          <button className="btn-add-luxury" onClick={createProductHandler} disabled={loadingCreate}>
            <FiPlus size={20} />
            {loadingCreate ? 'در حال ایجاد...' : 'افزودن محصول جدید'}
          </button>
        </div>

        {loadingDelete && <Loader />}
        
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error.data?.message || error.error}</Message>
        ) : (
          <div className="admin-card">
            
            {/* --- نوار فیلتر و جستجو --- */}
            <div className="admin-filter-bar">
              <div className="search-input-wrapper">
                <FiSearch className="search-icon" />
                <input 
                  type="text" 
                  placeholder="جستجو با نام یا برند محصول..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="filter-search-input"
                />
              </div>

              <div className="filter-selects-wrapper">
                <div className="select-with-icon">
                  <FiFilter className="select-icon" />
                  <select 
                    value={categoryFilter} 
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">همه دسته‌بندی‌ها</option>
                    {uniqueCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {displayedProducts.length === 0 ? (
              <Message>هیچ محصولی با این مشخصات یافت نشد.</Message>
            ) : (
              <>
                {/* نمای جدول برای دسکتاپ */}
                <div className="desktop-table-wrapper">
                  <table className="luxury-admin-table">
                    <thead>
                      <tr>
                        <th>تصویر</th>
                        <th>نام محصول</th>
                        <th>قیمت فروش</th>
                        <th>دسته‌بندی</th>
                        <th>برند</th>
                        <th>عملیات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedProducts.map((product) => (
                        <tr key={product._id}>
                          <td>
                            <div className="product-thumbnail-sm">
                              {product.image ? (
                                <img src={product.image} alt={product.name} />
                              ) : (
                                <FiImage className="text-muted" size={20} />
                              )}
                            </div>
                          </td>

                          <td className="fw-bold text-dark">{product.name}</td>

                          <td className="price-cell">
                            {product.price.toLocaleString()} <span>تومان</span>
                          </td>

                          <td>
                            <span className="category-badge">
                              <FiLayers size={12} /> {product.category}
                            </span>
                          </td>

                          <td>
                            <span className="brand-text">
                              <FiTag size={12} /> {product.brand}
                            </span>
                          </td>

                          <td>
                            <div className="action-buttons-flex">
                              <Link to={`/admin/product/${product._id}/edit`} className="btn-action-icon edit" title="ویرایش">
                                <FiEdit3 size={18} />
                              </Link>
                              <button 
                                className="btn-action-icon delete" 
                                onClick={() => deleteHandler(product._id)}
                                title="حذف محصول"
                              >
                                <FiTrash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* نمای کارتی برای موبایل */}
                <div className="mobile-cards-wrapper">
                  {displayedProducts.map((product) => (
                    <div key={product._id} className="admin-mobile-card">
                      <div className="mobile-product-header">
                        <div className="product-thumbnail-md">
                          {product.image ? (
                            <img src={product.image} alt={product.name} />
                          ) : (
                            <FiImage className="text-muted" size={24} />
                          )}
                        </div>
                        <div className="mobile-product-title">{product.name}</div>
                      </div>

                      <div className="mobile-card-body">
                        <div className="mobile-info-row">
                          <span className="row-label">قیمت:</span>
                          <span className="row-value text-teal fw-bold">
                            {product.price.toLocaleString()} تومان
                          </span>
                        </div>

                        <div className="mobile-info-row">
                          <span className="row-label">دسته‌بندی:</span>
                          <span className="row-value category-badge">
                            {product.category}
                          </span>
                        </div>

                        <div className="mobile-info-row">
                          <span className="row-label">برند:</span>
                          <span className="row-value brand-text">
                            {product.brand}
                          </span>
                        </div>
                      </div>

                      <div className="mobile-card-actions">
                        <Link to={`/admin/product/${product._id}/edit`} className="btn-mobile-action edit">
                          <FiEdit3 /> ویرایش
                        </Link>
                        <button className="btn-mobile-action delete" onClick={() => deleteHandler(product._id)}>
                          <FiTrash2 /> حذف
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* بخش صفحه‌بندی (Pagination) */}
            <div className="pagination-wrapper">
              <Paginate pages={data.pages} page={data.page} isAdmin={true} />
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListScreen;