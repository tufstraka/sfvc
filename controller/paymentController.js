import axios from 'axios';
import Sale from '../model/sales.js';

export const initiateSTKPush = async (req, res) => {
  try {
    const {
      name,
      email,
      tshirtSize,
      tshirtType,
      pickup,
      phoneNumber,
      totalAmount,
    } = req.body;

    const userId = Math.floor(Math.random() * 10000000);

    const tokenResponse = await axios.post(
      'https://api-omnichannel-uat.azure-api.net/v2.1/oauth/token',
      {
        grant_type: 'client_credentials',
        client_id: process.env.ClientId,
        client_secret: process.env.ClientSecret,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const authToken = tokenResponse.data.access_token;

    const stkPushResponse = await axios.post(
      'https://api-omnichannel-uat.azure-api.net/v1/stkussdpush/stk/initiate',
      {
        phoneNumber: phoneNumber,
        reference: `REF${userId}`,
        amount: totalAmount,
        telco: 'SAF',
        countryCode: 'KE',
        callBackUrl: 'https://www.lnmb-run.org/payment/callback',
        errorCallBackUrl: 'https://www.lnmb-run.org/payment/error-callback',
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (stkPushResponse.status === 202) {
      const payment = new Sale({
        name,
        email,
        tshirtSize,
        tshirtType,
        pickup,
        phoneNumber,
        reference: `REF${userId}`,
        totalAmount,
      });

      const paymentDetails = await payment.save();

      res.status(200).json(paymentDetails);
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: 'Internal server error' });
  }
};
