import axios from 'axios';

// در حالت تست (Sandbox) این مقادیر ثابت هستند
const ZARINPAL_URL = 'https://sandbox.zarinpal.com/pg/v4/payment';
const MERCHANT_ID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'; // کد مرچنت مخصوص تست

// تابع درخواست پرداخت (کاربر را به درگاه می‌فرستد)
export const requestPayment = async (amount, callbackUrl, description, email, mobile) => {
  try {
    const response = await axios.post(`${ZARINPAL_URL}/request.json`, {
      merchant_id: MERCHANT_ID,
      amount: amount,
      callback_url: callbackUrl,
      description: description,
      metadata: {
        email: email,
        mobile: mobile,
      },
    });

    const { data, errors } = response.data;

    if (errors && errors.length > 0) {
      throw new Error(JSON.stringify(errors));
    }

    return {
      authority: data.authority,
      paymentUrl: `https://sandbox.zarinpal.com/pg/StartPay/${data.authority}`,
    };
  } catch (error) {
    console.error('Zarinpal Request Error:', error.message);
    throw error;
  }
};

// تابع تایید پرداخت (وقتی کاربر از بانک برمی‌گردد)
export const verifyPayment = async (amount, authority) => {
  try {
    const response = await axios.post(`${ZARINPAL_URL}/verify.json`, {
      merchant_id: MERCHANT_ID,
      amount: amount,
      authority: authority,
    });

    const { data, errors } = response.data;

    if (errors && errors.length > 0) {
      throw new Error(JSON.stringify(errors));
    }

    return data; 
  } catch (error) {
    console.error('Zarinpal Verify Error:', error.message);
    throw error;
  }
};