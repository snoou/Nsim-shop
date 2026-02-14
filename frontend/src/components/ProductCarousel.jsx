import { Link } from 'react-router-dom';
import { Carousel, Image, Button } from 'react-bootstrap';
import { FiArrowRight, FiArrowLeft, FiShoppingBag } from 'react-icons/fi'; // آیکون‌های ناوبری
import Message from './Message';
import { useGetTopProductsQuery } from '../slices/productsApiSlice';

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) return <div className="hero-loader"></div>; // یک لودر خالی یا Skeleton
  if (error) return <Message variant='danger'>{error?.data?.message || error.error}</Message>;

  return (
    <div className="hero-section-wrapper">
      <Carousel 
        pause='hover' 
        className='fashion-carousel'
        indicators={true} // دایره‌های پایین اسلایدر
        prevIcon={<span className="custom-control-icon"><FiArrowRight size={24}/></span>}
        nextIcon={<span className="custom-control-icon"><FiArrowLeft size={24}/></span>}
      >
        {products.map((product) => (
          <Carousel.Item key={product._id} interval={5000}>
            <div className="hero-slide-content">
              
              {/* تصویر پس‌زمینه با افکت تاریک شدن ملایم */}
              <div className="hero-image-container">
                <Image src={product.image} alt={product.name} className="hero-img" />
                <div className="hero-overlay-gradient"></div>
              </div>

              {/* باکس اطلاعات شیشه‌ای (شناور) */}
              <Carousel.Caption className="hero-caption">
                <div className="glass-info-card">
                  <span className="hero-badge">محبوب‌ترین‌ها</span>
                  
                  <h2 className="hero-title">
                    {product.name}
                  </h2>
                  
                  <div className="hero-price-row">
                    <span className="price-label">فقط:</span>
                    <span className="price-value">{product.price.toLocaleString()}</span>
                    <span className="price-unit">تومان</span>
                  </div>

                  <p className="hero-desc d-none d-md-block">
                    {product.description && product.description.substring(0, 80)}...
                  </p>

                  <Link to={`/product/${product._id}`}>
                    <Button className="hero-btn">
                      <FiShoppingBag className="ms-2" />
                      مشاهده و خرید
                    </Button>
                  </Link>
                </div>
              </Carousel.Caption>
              
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default ProductCarousel;