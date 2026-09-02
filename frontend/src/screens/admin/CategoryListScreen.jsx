import React from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import {
  useFetchCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} from '../../slices/categoryApiSlice';
import '../../assets/styles/AdminCategory.css'; 

const CategoryListScreen = () => {
  const { data: categories, isLoading, error, refetch } = useFetchCategoriesQuery();
  const [createCategory, { isLoading: loadingCreate }] = useCreateCategoryMutation();
  const [deleteCategory, { isLoading: loadingDelete }] = useDeleteCategoryMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('آیا از حذف این دسته‌بندی مطمئن هستید؟')) {
      try {
        await deleteCategory(id);
        toast.success('دسته‌بندی با موفقیت حذف شد');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const createCategoryHandler = async () => {
    if (window.confirm('آیا می‌خواهید یک دسته‌بندی جدید ایجاد کنید؟')) {
      try {
        await createCategory();
        toast.success('دسته‌بندی جدید ایجاد شد، حالا آن را ویرایش کنید');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">مدیریت دسته‌بندی‌ها</h1>
        <button className="admin-btn admin-btn-primary" onClick={createCategoryHandler}>
          <FaPlus /> ایجاد دسته‌بندی
        </button>
      </div>

      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>شناسه (ID)</th>
                <th>تصویر</th>
                <th>نام دسته‌بندی (فارسی)</th>
                <th>اسلاگ (انگلیسی)</th> 
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id}>
                  <td>{category._id}</td>
                  <td>
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="admin-table-img" 
                    />
                  </td>
                  <td>{category.name}</td>
                  <td>{category.slug}</td>
                  <td>
                    <Link to={`/admin/category/${category._id}/edit`} className="admin-icon-btn admin-edit-btn">
                      <FaEdit size={16} />
                    </Link>
                    <button onClick={() => deleteHandler(category._id)} className="admin-icon-btn admin-delete-btn">
                      <FaTrash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CategoryListScreen;