import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
// استفاده از آیکون‌های ظریف‌تر
import { FiShoppingBag, FiUser, FiSearch, FiMenu } from 'react-icons/fi'; 
import { RiAdminLine } from 'react-icons/ri';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import SearchBox from './SearchBox'; // فرض بر این است که این کامپوننت هم استایلش مینیمال می‌شود
import logo from '../assets/logo.png';
import { resetCart } from '../slices/cartSlice';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  // محاسبه تعداد کل آیتم‌ها
  const cartCount = cartItems.reduce((a, c) => a + c.qty, 0);

  return (
    <header className="sticky-top">
      {/* نوار اعلان بالای سایت - برای فروشگاه‌های فشن عالیه */}
      <div className="bg-dark text-white text-center py-1 small" style={{fontSize: '12px'}}>
        ارسال رایگان برای خریدهای بالای ۲ میلیون تومان | کد تخفیف: SUMMER1403
      </div>

      <Navbar expand='lg' className='fashion-header' collapseOnSelect>
        <Container>
          {/* لوگو سمت راست قرار می‌گیرد چون RTL هستیم */}
          <Navbar.Brand as={Link} to='/' className='brand-logo'>
            <img src={logo} alt='NSIM' style={{ height: '35px', objectFit: 'contain' }} />
            <span style={{ fontFamily: 'Playfair Display, serif' }}>NSIM</span>
          </Navbar.Brand>

          {/* دکمه همبرگری برای موبایل */}
          <Navbar.Toggle aria-controls='basic-navbar-nav' className="border-0 shadow-none">
             <FiMenu size={24} />
          </Navbar.Toggle>

          <Navbar.Collapse id='basic-navbar-nav'>
            {/* منوی وسط چین برای دسته‌بندی‌ها */}
            <Nav className='mx-auto my-3 my-lg-0'>
              <Nav.Link as={Link} to='/' className='nav-link-custom'>صفحه اصلی</Nav.Link>
              <Nav.Link as={Link} to='/shop/manteau' className='nav-link-custom'>مانتو و رویه</Nav.Link>
              <Nav.Link as={Link} to='/shop/scarf' className='nav-link-custom'>شال و روسری</Nav.Link>
              <Nav.Link as={Link} to='/shop/pants' className='nav-link-custom'>شلوار</Nav.Link>
            </Nav>

            {/* بخش سمت چپ: سرچ، اکانت، سبد خرید */}
            <Nav className='align-items-center gap-3'>
              {/* سرچ باکس بهتره که مینیمال باشه */}
              <div className="d-none d-lg-block">
                 <SearchBox /> 
              </div>

              <Nav.Link as={Link} to='/cart' className='nav-link-custom icon-wrapper p-0'>
                <FiShoppingBag title="سبد خرید" />
                {cartCount > 0 && (
                  <Badge pill className='badge-custom'>
                    {cartCount}
                  </Badge>
                )}
              </Nav.Link>

              {userInfo ? (
                <NavDropdown 
                  title={<><FiUser className="me-1"/> {userInfo.name}</>} 
                  id='username'
                  align="end" // در RTL این باعث میشه دراپ‌داون درست باز بشه
                  className="custom-dropdown"
                >
                  <NavDropdown.Item as={Link} to='/profile' className="text-end">
                    پروفایل من
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logoutHandler} className="text-end text-danger">
                    خروج از حساب
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link as={Link} to='/login' className='nav-link-custom btn btn-outline-dark px-3 py-1 rounded-pill' style={{fontSize: '0.85rem'}}>
                  <FiUser className="ms-1" /> ورود / عضویت
                </Nav.Link>
              )}

              {userInfo && userInfo.isAdmin && (
                <NavDropdown 
                  title={<><RiAdminLine className="me-1"/> مدیریت</>} 
                  id='adminmenu'
                  align="end"
                >
                  <NavDropdown.Item as={Link} to='/admin/productlist' className="text-end">محصولات</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to='/admin/orderlist' className="text-end">سفارشات</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to='/admin/userlist' className="text-end">کاربران</NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;