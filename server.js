import express from 'express';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import payment from './routes/payment.js';
import mongoose from 'mongoose';

const app = express();

dotenv.config();

const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI;

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 14, // limit each IP to 14 requests per 10 minutes
  message: 'Too many requests from this IP, please try again later',
});

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', payment);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
