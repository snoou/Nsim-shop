import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { FiSave, FiArrowRight, FiUploadCloud, FiImage, FiLayers, FiTag, FiDollarSign, FiBox } from 'react-icons/fi';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from '../../slices/productsApiSlice';

const ProductEditScreen = () => {
  const { id: productId } = useParams();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

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
    <div className="admin-edit-wrapper">
      <Container>
        {/* هدر صفحه */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h1 className="edit-page-title">ویرایش محصول</h1>
            <p className="text-muted small mb-0">اطلاعات محصول را به‌روزرسانی کنید</p>
          </div>
          <Link to='/admin/productlist' className="btn-back-outline">
            <FiArrowRight /> بازگشت
          </Link>
        </div>

        {loadingUpdate && <Loader />}
        
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error.data.message}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Row className="gy-5">
              
              {/* ستون اول: مدیریت تصویر (سمت چپ در دسکتاپ) */}
              <Col lg={4}>
                <div className="image-upload-card">
                  <h5 className="mb-4 fw-bold">تصویر محصول</h5>
                  
                  {/* پیش‌نمایش تصویر */}
                  <div className="image-preview-box mb-3">
                    {image ? (
                      <img src={image} alt="Product Preview" className="img-fluid rounded" />
                    ) : (
                      <div className="placeholder-image">
                        <FiImage size={40} />
                        <span>هنوز تصویری انتخاب نشده</span>
                      </div>
                    )}
                  </div>

                  {/* اینپوت فایل کاستوم */}
                  <Form.Group controlId='image-file' className="mb-3">
                    <Form.Label className="upload-btn-label w-100">
                      {loadingUpload ? 'در حال آپلود...' : (
                        <>
                          <FiUploadCloud size={20} className="me-2" />
                          آپلود تصویر جدید
                        </>
                      )}
                      <Form.Control
                        type='file'
                        onChange={uploadFileHandler}
                        className="d-none" // مخفی کردن اینپوت اصلی زشت
                      ></Form.Control>
                    </Form.Label>
                  </Form.Group>

                  {/* اینپوت متنی لینک عکس (برای چک کردن مسیر) */}
                  <Form.Group controlId='image'>
                    <Form.Control
                      type='text'
                      placeholder='یا آدرس تصویر را وارد کنید'
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="modern-input small-text"
                    ></Form.Control>
                  </Form.Group>
                </div>
              </Col>

              {/* ستون دوم: فرم مشخصات */}
              <Col lg={8}>
                <div className="details-card">
                  <h5 className="mb-4 fw-bold">مشخصات عمومی</h5>
                  
                  <Row className="g-4">
                    {/* نام محصول (تمام عرض) */}
                    <Col xs={12}>
                      <Form.Group controlId='name'>
                        <Form.Label className="modern-label">نام محصول</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder='مثلاً: مانتو کتی مدل سارا'
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="modern-input"
                        ></Form.Control>
                      </Form.Group>
                    </Col>

                    {/* برند و دسته‌بندی */}
                    <Col md={6}>
                      <Form.Group controlId='brand'>
                        <Form.Label className="modern-label"><FiLayers className="me-1"/> برند</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder='نام برند'
                          value={brand}
                          onChange={(e) => setBrand(e.target.value)}
                          className="modern-input"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId='category'>
                        <Form.Label className="modern-label"><FiTag className="me-1"/> دسته‌بندی</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder='مثلاً: مانتو، شلوار...'
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="modern-input"
                        ></Form.Control>
                      </Form.Group>
                    </Col>

                    {/* قیمت و موجودی */}
                    <Col md={6}>
                      <Form.Group controlId='price'>
                        <Form.Label className="modern-label"><FiDollarSign className="me-1"/> قیمت (تومان)</Form.Label>
                        <Form.Control
                          type='number'
                          placeholder='0'
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="modern-input"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId='countInStock'>
                        <Form.Label className="modern-label"><FiBox className="me-1"/> موجودی انبار</Form.Label>
                        <Form.Control
                          type='number'
                          placeholder='0'
                          value={countInStock}
                          onChange={(e) => setCountInStock(e.target.value)}
                          className="modern-input"
                        ></Form.Control>
                      </Form.Group>
                    </Col>

                    {/* توضیحات */}
                    <Col xs={12}>
                      <Form.Group controlId='description'>
                        <Form.Label className="modern-label">توضیحات محصول</Form.Label>
                        <Form.Control
                          as='textarea'
                          rows={5}
                          placeholder='توضیحات کامل درباره جنس، سایز و ویژگی‌ها...'
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="modern-input textarea-custom"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-end mt-5">
                    <Button
                      type='submit'
                      className='btn-submit-fashion'
                      disabled={loadingUpdate || loadingUpload}
                    >
                      <FiSave className="ms-2" size={20} />
                      {loadingUpdate ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        )}
      </Container>
    </div>
  );
};

export default ProductEditScreen;