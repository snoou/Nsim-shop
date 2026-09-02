import axios from 'axios';

const ZARINPAL_URL = 'https://sandbox.zarinpal.com/pg/v4/payment';
const MERCHANT_ID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'; 

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