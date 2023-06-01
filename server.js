import express from 'express';
import dotenv from 'dotenv';
import payment from './routes/payment.js';
import mongoose from 'mongoose';

const app = express();

dotenv.config();

const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI;

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', payment);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
