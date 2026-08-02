import { Row, Col, Container } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { FiArrowRight, FiGrid } from 'react-icons/fi'; // آیکون‌های مدرن
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  return (
    <div className="home-screen-wrapper">
      <style>{`
        .home-screen-wrapper {
          font-family: 'Vazirmatn', sans-serif;
          direction: rtl;
          background-color: #F9F9F7;
          min-height: 100vh;
          padding-bottom: 3rem;
        }
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 3rem 0 2rem;
        }
        .section-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: #1a1a1a;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .section-title::after {
          content: '';
          height: 4px;
          width: 50px;
          background: #1a1a1a;
          display: inline-block;
          border-radius: 10px;
        }
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #666;
          text-decoration: none;
          font-weight: 600;
          padding: 8px 16px;
          background: #fff;
          border-radius: 50px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.03);
          transition: all 0.3s;
        }
        .back-link:hover {
          color: #000;
          box-shadow: 0 6px 15px rgba(0,0,0,0.06);
          transform: translateX(-5px);
        }
        .product-grid {
          margin-top: 1rem;
        }
      `}</style>

      {/* نمایش اسلایدر فقط در صفحه اصلی (بدون جستجو) */}
      {!keyword ? (
        <div className="hero-section">
          <ProductCarousel />
        </div>
      ) : (
        <Container className="pt-4">
          <Link to='/' className='back-link'>
             <span>بازگشت به خانه</span>
             <FiArrowRight />
          </Link>
        </Container>
      )}

      <Container>
        {isLoading ? (
          <div className="d-flex justify-content-center py-5">
            <Loader />
          </div>
        ) : error ? (
          <Message variant='danger'>
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <>
            <Meta />
            
            <div className="section-header">
              <h1 className="section-title">
                {keyword ? `نتایج جستجو برای: ${keyword}` : 'جدیدترین محصولات'}
              </h1>
              {!keyword && (
                 <div className="text-muted d-none d-md-block">
                    <FiGrid className="me-2" /> {data.products.length} کالا
                 </div>
              )}
            </div>

            <Row className="product-grid g-4">
              {data.products.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                  {/* کامپوننت Product باید استایل کارت‌های جدید را داشته باشد */}
                  <Product product={product} />
                </Col>
              ))}
            </Row>

            {/* صفحه بندی */}
            <div className="d-flex justify-content-center mt-5">
              <Paginate
                pages={data.pages}
                page={data.page}
                keyword={keyword ? keyword : ''}
              />
            </div>
          </>
        )}
      </Container>
    </div>
  );
};

export default HomeScreen;