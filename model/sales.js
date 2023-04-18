import mongoose from 'mongoose';

const salesData = new mongoose.Schema({
  name: {
          type: String,
          required: true,
        },
  
  email: {
          type: String,
          required: true,
        },
  
  tshirtSize: {
          type: String,
          required: true,
        },
  
  tshirtType: {
          type: String,
          required: true,
        },
  
  pickup: {
          type: String,
          required: true,
        },
  
  phoneNumber: {
          type: String,
          required: true,
        },
  
  reference: {
          type: String,
          required: true,
        },
  
  totalAmount: {
          type: Number,
          required: true,
        },
});

const Sale = mongoose.model('Sales', salesData, 'tshirtSales');
export default Sale;

