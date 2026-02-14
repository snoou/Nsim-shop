import { Link, useParams } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';
import { FiEdit3, FiTrash2, FiPlus, FiBox, FiLayers, FiTag, FiDollarSign } from 'react-icons/fi';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useCreateProductMutation,
} from '../../slices/productsApiSlice';
import { toast } from 'react-toastify';

const ProductListScreen = () => {
  const { pageNumber } = useParams();

  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
  });

  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

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

  const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();

  const createProductHandler = async () => {
    if (window.confirm('آیا می‌خواهید یک محصول جدید ایجاد کنید؟')) {
      try {
        await createProduct();
        refetch();
        toast.success('محصول جدید ایجاد شد');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="admin-product-list-wrapper">
      {/* هدر صفحه */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 className="admin-page-title">لیست محصولات</h1>
          <p className="text-muted small mb-0">مدیریت موجودی و کاتالوگ فروشگاه</p>
        </div>
        <Button className="btn-create-product" onClick={createProductHandler}>
          <FiPlus size={20} className="me-2" />
          محصول جدید
        </Button>
      </div>

      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}
      
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error.data.message}</Message>
      ) : (
        <>
          <div className="table-responsive-custom">
            <table className="admin-fashion-table">
              <thead>
                <tr>
                  <th>تصویر</th>
                  <th>نام محصول</th>
                  <th>قیمت</th>
                  <th>دسته‌بندی</th>
                  <th>برند</th>
                  <th className="text-center">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {data.products.map((product) => (
                  <tr key={product._id}>
                    {/* تصویر محصول (اضافه شده) */}
                    <td data-label="تصویر">
                      <div className="product-thumbnail-wrapper">
                        <img src={product.image} alt={product.name} className="product-thumbnail" />
                      </div>
                    </td>

                    <td data-label="نام محصول">
                      <div className="fw-bold text-dark">{product.name}</div>
                      <div className="small text-muted d-md-none">ID: {product._id.substring(0, 5)}...</div>
                    </td>

                    <td data-label="قیمت">
                      <div className="d-flex align-items-center price-cell">
                        <FiDollarSign className="text-accent me-1" size={14} />
                        {product.price.toLocaleString()}
                      </div>
                    </td>

                    <td data-label="دسته‌بندی">
                      <span className="category-pill">
                        <FiLayers className="me-1" size={12}/> {product.category}
                      </span>
                    </td>

                    <td data-label="برند">
                       <span className="text-muted"><FiTag className="me-1" size={12}/> {product.brand}</span>
                    </td>

                    <td data-label="عملیات" className="text-center">
                      <div className="action-buttons">
                        <Link to={`/admin/product/${product._id}/edit`} className="btn-icon-edit" title="ویرایش">
                          <FiEdit3 />
                        </Link>
                        <button 
                          className="btn-icon-delete" 
                          onClick={() => deleteHandler(product._id)}
                          title="حذف"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="d-flex justify-content-center mt-5">
            <Paginate pages={data.pages} page={data.page} isAdmin={true} />
          </div>
        </>
      )}
    </div>
  );
};

export default ProductListScreen;