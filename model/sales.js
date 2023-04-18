import mongoose from 'mongoose';

const salesData = new mongoose.Schema({
  name: String,
  email: String,
  tshirtSize: String,
  tshirtType: String,
  pickup: String,
  phoneNumber: String,
  referenceNumber: String,
  totalAmount: Number,
});

const Sale = mongoose.model('Sales', salesData, 'tshirtSales');
export default Sale;

