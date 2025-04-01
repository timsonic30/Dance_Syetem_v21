const mongoose = require("mongoose");
const { Schema } = mongoose;

//課程collection部份
const transactionSchema = new Schema({
  type: {
    type: String,
    enum: ['Class', 'Room Rental', 'Package', 'Tee','class', 'room rental', 'package', 'tee'], // Allowed values
    required: true
  },
  detail: {
    type: String,    
    required: true
  },
  userId: {
    type: String, // Assuming this is a reference to a user in your database
    required: true
  },
  price: {
    type: String, // Consider using Number instead of String for better numeric calculations
    required: true
  },
  status: {
    type: String,
    enum: ['Shopping Cart', 'Pending Payment', 'Paid'], // Transaction states
    default: 'Shopping Cart' // Default status
  },
  attendance:{
    type: String,
    enum: ['None', 'Attended', 'Absent', 'Sick Leaves'],
    default: 'None'
  },
  createdAt: {
    type: Date,
    default: Date.now // Automatically sets the creation date
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });


const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;

// 建立object及save到mongodb的範例
// const newTransaction = new Transaction({
//   type: 'Class',
//   detail: 'Room Rental ID',
//   userId: 'String',
//   price: '2300',
//   status: 'Shopping Cart'  }
// );

// newTransaction
//   .save()
//   .then((savedDoc) => {
//     console.log("儲存完畢, 資料是:");
//     console.log(savedDoc);
//   })
//   .catch((e) => {
//     console.log(e);
//   });
