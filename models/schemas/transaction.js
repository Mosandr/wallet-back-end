const { Schema } = require('mongoose')

const transactionSchema = Schema(
  {
    date: {
      type: String,
      match: [
        /^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.(\d{2})\s*$/,
        'Date must be in format DD.MM.YY',
      ],
      required: [true, 'Date is required'],
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
      required: [true, 'Comment is required'],
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
  },
  { versionKey: false, timestamps: true },
)

module.exports = transactionSchema
