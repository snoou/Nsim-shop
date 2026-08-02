import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords, image, url }) => {
  const siteName = "نسیم";
  const fullTitle = title === 'فروشگاه اینترنتی نسیم | خرید لباس و خواروبار' ? title : `${title} | ${siteName}`;

  return (
    <Helmet>
      {/* 1. تنظیمات اصلی و عنوان برای موتورهای جستجو */}
      <title>{fullTitle}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
      <meta name='robots' content='index, follow' />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="Persian" />
      <link rel="canonical" href={url ? url : window.location.href} />

      {/* 2. تنظیم رنگ نوار مرورگر موبایل (رنگ سبز کله‌غازی برند نسیم) */}
      <meta name="theme-color" content="#0D9488" />
      <meta name="msapplication-navbutton-color" content="#0D9488" />
      <meta name="apple-mobile-web-app-status-bar-style" content="#0D9488" />

      {/* 3. اپن گراف (Open Graph) برای پیش‌نمایش لینک در تلگرام، واتس‌اپ و ... */}
      <meta property='og:type' content='website' />
      <meta property='og:title' content={fullTitle} />
      <meta property='og:description' content={description} />
      <meta property='og:site_name' content={siteName} />
      <meta property='og:url' content={url ? url : window.location.href} />
      <meta property='og:image' content={image} />
      <meta property='og:image:alt' content={title} />
      <meta property='og:locale' content='fa_IR' />

      {/* 4. توییتر کارت (Twitter Card) */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={fullTitle} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={image} />
      <meta name='twitter:creator' content='@nasim_store' />
    </Helmet>
  );
};

// مقادیر پیش‌فرض برای زمانی که به کامپوننت دیتایی پاس داده نشود
Meta.defaultProps = {
  title: 'فروشگاه اینترنتی نسیم | خرید لباس و خواروبار',
  description: 'فروشگاه همه‌کاره نسیم؛ خرید آنلاین جدیدترین کالکشن‌های پوشاک و تازه‌ترین محصولات سوپرمارکتی با ارسال سریع و ضمانت کیفیت.',
  keywords: 'فروشگاه اینترنتی نسیم, خرید آنلاین لباس, سوپرمارکت آنلاین, خرید مانتو, خرید برنج و روغن, لباس زنانه, مواد غذایی تازه',
  image: '/images/nasim-share-image.jpg', // حتماً یک عکس با کیفیت از لوگو یا بنر سایت در پوشه public/images قرار بده
};

export default Meta;