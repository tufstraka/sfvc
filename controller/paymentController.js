import axios from 'axios';
import Payment from '../model/sales.js';

export const initiateSTKPush = async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const tshirtSize = req.body.tshirtSize;
    const tshirtType = req.body.tshirtType;
    const pickup = req.body.pickup;
    const phone = req.body.phone;
    const amount = req.body.totalAmount;
    const userId = Math.floor(Math.random() * 1000000);

    // Get authorization
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

    // Initiate STK Push
    const stkResponse = await axios.post(
      'https://api-omnichannel-uat.azure-api.net/v1/stkussdpush/stk/initiate',
      {
        phoneNumber: phone,
        reference: `REF${userId}`,
        amount: amount,
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

    //Save to database
    const payment = new Payment({
      name: name,
      email: email,
      tshirtSize: tshirtSize,
      tshirtType: tshirtType,
      pickup: pickup,
      phoneNumber: phone,
      referenceNumber: `REF${userId}`,
      totalAmount: amount,
    });

    await payment.save();

    res.status(200).json({
        name: name,
        email: email,
        tshirtSize: tshirtSize,
        referenceNumber: `REF${userId}`,
        phoneNumber: phone,
        totalAmount: amount,
        message: 'Payment initiated',
      });
    } catch (error) {
      console.error(error);
  
      res.status(500).json({ error: 'Internal server error' });
    }
  };