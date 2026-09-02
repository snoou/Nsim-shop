import React from 'react';
import { Link } from 'react-router-dom';
import { FiEdit, FiTrash2, FiPlus, FiImage } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import {
  useGetPostersQuery,
  useCreatePosterMutation,
  useDeletePosterMutation
} from '../../slices/postersApiSlice';

const PosterListScreen = () => {
  const { data: posters, isLoading, error, refetch } = useGetPostersQuery();
  const [createPoster, { isLoading: loadingCreate }] = useCreatePosterMutation();
  const [deletePoster, { isLoading: loadingDelete }] = useDeletePosterMutation();

  const createPosterHandler = async () => {
    if (window.confirm('آیا می‌خواهید یک پوستر جدید بسازید؟')) {
      try {
        await createPoster().unwrap();
        refetch();
        toast.success('پوستر ساخته شد. حالا آن را ویرایش کنید.');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('آیا از حذف این پوستر مطمئن هستید؟')) {
      try {
        await deletePoster(id).unwrap();
        refetch();
        toast.success('پوستر حذف شد');
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
            <h1 className="admin-page-title">مدیریت پوسترها</h1>
            <p className="admin-page-subtitle">لیست بنرها و پوسترهای صفحه اصلی را مدیریت کنید</p>
          </div>
          <button onClick={createPosterHandler} className="btn-submit-solid" style={{ width: 'auto', padding: '10px 20px' }}>
            <FiPlus size={18} style={{ marginLeft: '8px' }} />
            ساخت پوستر جدید
          </button>
        </div>

        {loadingCreate && <Loader />}
        {loadingDelete && <Loader />}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error?.data?.message || error.error}</Message>
        ) : (
          <div className="admin-card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
                <thead style={{ backgroundColor: 'var(--bg-main, #f9fafb)', borderBottom: '1px solid var(--border-light, #e5e7eb)' }}>
                  <tr>
                    <th style={{ padding: '16px', color: 'var(--text-muted, #6b7280)', fontWeight: '600', fontSize: '14px' }}>آیدی</th>
                    <th style={{ padding: '16px', color: 'var(--text-muted, #6b7280)', fontWeight: '600', fontSize: '14px' }}>تصویر</th>
                    <th style={{ padding: '16px', color: 'var(--text-muted, #6b7280)', fontWeight: '600', fontSize: '14px' }}>عنوان پوستر</th>
                    <th style={{ padding: '16px', color: 'var(--text-muted, #6b7280)', fontWeight: '600', fontSize: '14px' }}>لینک هدایت</th>
                    <th style={{ padding: '16px', color: 'var(--text-muted, #6b7280)', fontWeight: '600', fontSize: '14px' }}>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {posters.map((poster) => (
                    <tr key={poster._id} style={{ borderBottom: '1px solid var(--border-light, #f3f4f6)' }}>
                      <td style={{ padding: '16px', fontSize: '13px', color: '#9ca3af', fontFamily: 'monospace' }}>
                        {poster._id.substring(0, 8)}...
                      </td>
                      <td style={{ padding: '16px' }}>
                        {poster.image ? (
                          <img src={poster.image} alt={poster.title} style={{ width: '70px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                        ) : (
                          <FiImage size={24} color="#ccc" />
                        )}
                      </td>
                      <td style={{ padding: '16px', fontWeight: '500', color: 'var(--text-dark, #111827)' }}>
                        {poster.title}
                      </td>
                      <td style={{ padding: '16px', color: 'var(--primary, #0D9488)', direction: 'ltr', textAlign: 'right' }}>
                        {poster.link}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Link to={`/admin/poster/${poster._id}/edit`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', backgroundColor: '#f3f4f6', color: '#4b5563', borderRadius: '6px', textDecoration: 'none' }}>
                            <FiEdit size={16} />
                          </Link>
                          <button onClick={() => deleteHandler(poster._id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PosterListScreen;