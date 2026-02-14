import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords, image, url }) => {
  const siteName = "PROSHOP";
  const fullTitle = title === 'Welcome To ProShop' ? title : `${title} | ${siteName}`;

  return (
    <Helmet>
      {/* 1. تنظیمات اصلی و عنوان */}
      <title>{fullTitle}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
      <meta name='robots' content='index, follow' />
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="Persian" />
      <link rel="canonical" href={url ? url : window.location.href} />

      {/* 2. تنظیم رنگ نوار مرورگر موبایل (Mobile Browser Color) */}
      {/* این باعث میشه نوار بالای کروم در موبایل به رنگ طلایی برند دربیاد */}
      <meta name="theme-color" content="#c5a065" />
      <meta name="msapplication-navbutton-color" content="#c5a065" />
      <meta name="apple-mobile-web-app-status-bar-style" content="#c5a065" />

      {/* 3. اپن گراف (Open Graph) برای تلگرام، واتس‌اپ و اینستاگرام */}
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
      <meta name='twitter:creator' content='@proshop_ir' />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'فروشگاه اینترنتی نسیم | خرید آنلاین لباس زنانه',
  description: 'جدیدترین کالکشن‌های مانتو، شال، شلوار و اکسسوری زنانه با کیفیت تضمینی. ارسال سریع به سراسر ایران و ضمانت بازگشت وجه.',
  keywords: 'خرید لباس زنانه, مانتو جدید, شال و روسری, خرید اینترنتی لباس, فروشگاه مد و فشن, لباس مجلسی, نسیم',
  image: '/images/share-image.jpg', // یک عکس پیش‌فرض با کیفیت (مثلاً لوگوی بزرگ یا بنر سایت) بزار اینجا
};

export default Meta;