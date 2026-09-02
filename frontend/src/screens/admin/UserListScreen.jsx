import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiShield, FiMail, FiEdit3, FiTrash2, FiSearch, FiFilter } from 'react-icons/fi';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useDeleteUserMutation, useGetUsersQuery } from '../../slices/usersApiSlice';
import { toast } from 'react-toastify';
import '../../assets/styles/UserListScreen.css';

const UserListScreen = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // all, admin, customer

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    
    return users.filter((user) => {
      const matchSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchRole = 
        roleFilter === 'all' || 
        (roleFilter === 'admin' && user.isAdmin) || 
        (roleFilter === 'customer' && !user.isAdmin);
      
      return matchSearch && matchRole;
    });
  }, [users, searchTerm, roleFilter]);

  const deleteHandler = async (id) => {
    if (window.confirm('آیا از حذف این کاربر اطمینان دارید؟ این عملیات غیرقابل بازگشت است.')) {
      try {
        await deleteUser(id);
        refetch();
        toast.success('کاربر با موفقیت حذف شد');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="admin-dashboard-wrapper">
      <div className="admin-container">
        
        <div className="admin-header-flex">
          <div>
            <h1 className="admin-page-title">لیست کاربران</h1>
            <p className="admin-page-subtitle">مدیریت مشتریان و سطح دسترسی مدیران سایت</p>
          </div>
          <span className="admin-count-badge">
            {filteredUsers ? filteredUsers.length : 0} کاربر یافت شد
          </span>
        </div>

        {loadingDelete && <Loader />}
        
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <div className="admin-card">
            
            <div className="admin-filter-bar">
              <div className="search-input-wrapper">
                <FiSearch className="search-icon" />
                <input 
                  type="text" 
                  placeholder="جستجو با نام یا ایمیل کاربر..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="filter-search-input"
                />
              </div>

              <div className="filter-selects-wrapper">
                <div className="select-with-icon">
                  <FiFilter className="select-icon" />
                  <select 
                    value={roleFilter} 
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">همه کاربران</option>
                    <option value="admin">مدیران (Admin)</option>
                    <option value="customer">مشتریان عادی</option>
                  </select>
                </div>
              </div>
            </div>

            {filteredUsers.length === 0 ? (
              <Message>هیچ کاربری با این مشخصات یافت نشد.</Message>
            ) : (
              <>
                <div className="desktop-table-wrapper">
                  <table className="luxury-admin-table">
                    <thead>
                      <tr>
                        <th>مشخصات کاربر</th>
                        <th>پست الکترونیک</th>
                        <th>نقش کاربری</th>
                        <th>شناسه یکتا</th>
                        <th>عملیات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user._id}>
                          <td>
                            <div className="user-info-cell">
                              <div className={`user-avatar-sm ${user.isAdmin ? 'admin-ring' : ''}`}>
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="user-name-text">{user.name}</span>
                            </div>
                          </td>
                          
                          <td>
                            <a href={`mailto:${user.email}`} className="user-email-text">
                              <FiMail className="me-1" size={14} /> {user.email}
                            </a>
                          </td>

                          <td>
                            {user.isAdmin ? (
                              <span className="role-badge admin">
                                <FiShield size={12} /> مدیر کل
                              </span>
                            ) : (
                              <span className="role-badge customer">
                                <FiUser size={12} /> مشتری
                              </span>
                            )}
                          </td>

                          <td className="id-cell">
                            #{user._id.substring(user._id.length - 6)}
                          </td>

                          <td>
                            <div className="action-buttons-flex">
                              {/* دکمه ویرایش برای همه باز است */}
                              <Link to={`/admin/user/${user._id}/edit`} className="btn-action-icon edit" title="ویرایش دسترسی">
                                <FiEdit3 size={18} />
                              </Link>
                              
                              {!user.isAdmin ? (
                                <button 
                                  className="btn-action-icon delete" 
                                  onClick={() => deleteHandler(user._id)}
                                  title="حذف کاربر"
                                >
                                  <FiTrash2 size={18} />
                                </button>
                              ) : (
                                <div className="btn-action-icon disabled" title="امکان حذف مدیر وجود ندارد">
                                  <FiShield size={18} />
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mobile-cards-wrapper">
                  {filteredUsers.map((user) => (
                    <div key={user._id} className="admin-mobile-card">
                      <div className="mobile-user-header">
                        <div className="d-flex align-items-center gap-3">
                          <div className={`user-avatar-sm ${user.isAdmin ? 'admin-ring' : ''}`}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="fw-bold text-dark">{user.name}</div>
                        </div>
                        {user.isAdmin ? (
                          <span className="role-badge admin"><FiShield size={12}/> مدیر</span>
                        ) : (
                          <span className="role-badge customer"><FiUser size={12}/> مشتری</span>
                        )}
                      </div>

                      <div className="mobile-card-body">
                        <div className="mobile-info-row">
                          <span className="row-label">ایمیل:</span>
                          <span className="row-value user-email-text">{user.email}</span>
                        </div>
                        <div className="mobile-info-row">
                          <span className="row-label">شناسه:</span>
                          <span className="row-value id-cell">#{user._id.substring(user._id.length - 6)}</span>
                        </div>
                      </div>

                      <div className="mobile-card-actions">
                        <Link to={`/admin/user/${user._id}/edit`} className="btn-mobile-action edit">
                          <FiEdit3 /> ویرایش
                        </Link>
                        {!user.isAdmin ? (
                          <button className="btn-mobile-action delete" onClick={() => deleteHandler(user._id)}>
                            <FiTrash2 /> حذف
                          </button>
                        ) : (
                          <div className="btn-mobile-action disabled">
                            <FiShield /> غیرقابل حذف
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserListScreen;