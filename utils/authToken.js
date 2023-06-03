import axios from "axios";

const authToken = async () => {
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

  return authToken;
};

export default authToken;
