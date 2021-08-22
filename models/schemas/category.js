const { Schema } = require('mongoose')

const categorySchema = Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    type: {
      type: String,
      enum: ['+', '-'],
      required: [true, 'Name is required'],
    },
  },
  { versionKey: false, timestamps: true },
)

module.exports = categorySchema
