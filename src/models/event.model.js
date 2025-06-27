const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const seatingOptionSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  available: {
    type: Number,
    required: true,
  },
});

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    artist: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      ref: "Category",
    },
    venue: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    bannerImage: {
      type: String,
      required: true,
    },
    price: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true,
      },
    },
    currency: {
      type: String,
      default: "USD",
    },
    availableTickets: {
      type: Number,
      required: true,
    },
    totalTickets: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "sold-out"],
      default: "active",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    trending: {
      type: Boolean,
      default: false,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    seatingOptions: [seatingOptionSchema],
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add pagination plugin
eventSchema.plugin(mongoosePaginate);

// Index for better query performance
eventSchema.index({ category: 1, status: 1 });
eventSchema.index({ featured: 1, status: 1 });
eventSchema.index({ trending: 1, status: 1 });
eventSchema.index({ date: 1, status: 1 });
eventSchema.index({ "price.min": 1, "price.max": 1 });

const Event = mongoose.model("Event", eventSchema);

module.exports = Event; 