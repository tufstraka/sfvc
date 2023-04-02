const dotenv = require("dotenv");
const express = require("express");
const axios = require("axios");
const rateLimit = require("express-rate-limit");
const app = express();

dotenv.config();
const port = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 14, // limit each IP to 14 requests per 10 minutes
  message: "Too many requests from this IP, please try again later",
});

app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/initiateSTKPush", async (req, res) => {
  try {
    const phone = req.body.phone;
    const amount = req.body.totalAmount;
    const userId = Math.floor(Math.random() * 1000000);

    // Get authorization
    const tokenResponse = await axios.post(
      "https://api-omnichannel-uat.azure-api.net/v2.1/oauth/token",
      {
        grant_type: "client_credentials",
        client_id: process.env.ClientId,
        client_secret: process.env.ClientSecret,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const authToken = tokenResponse.data.access_token;

    // Initiate STK push
    const response = await axios.post(
      "https://api-omnichannel-uat.azure-api.net/v1/stkussdpush/stk/initiate",
      {
        phoneNumber: phone,
        reference: `REF${userId}`,
        amount: amount,
        telco: "SAF",
        countryCode: "KE",
        callBackUrl: "https://www.lnmb-run.org/payment/callback",
        errorCallBackUrl: "https://www.lnmb-run.org/payment/error-callback",
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({
      referenceNumber: `REF${userId}`,
      phoneNumber: phone,
      totalAmount; amount,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
