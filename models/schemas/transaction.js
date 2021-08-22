const { Schema } = require('mongoose')

const transactionSchema = Schema(
  {
    timeStamp: {
      type: Number,
      required: [true, 'TimeStamp is required'],
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    month: {
      type: String,
      required: [true, 'Month is required'],
    },
    year: {
      type: String,
      required: [true, 'Year is required'],
    },
    type: {
      type: String,
      enum: ['+', '-'],
      required: [true, 'Type is required'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'category',
      required: [true, 'Category is required'],
    },
    comment: {
      type: String,
      default: 'No comment',
    },
    sum: {
      type: Number,
      required: [true, 'Sum is required'],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: [true, 'Owner is required'],
    },
    monthlyBalance: {
      type: Number,
      required: [true, 'MonthlyBalance is required'],
    },
  },
  { versionKey: false, timestamps: true },
)

module.exports = transactionSchema
