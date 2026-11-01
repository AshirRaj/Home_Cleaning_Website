import mongoose from 'mongoose';

const addonSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  icon: { type: String, default: 'Plus' },
  isActive: { type: Boolean, default: true },
});

const faqSchema = new mongoose.Schema({
  q: { type: String, required: true },
  a: { type: String, required: true },
});

const serviceSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
    },
    iconName: {
      type: String,
      default: 'Sparkles',
    },
    badge: {
      type: String,
      default: '',
    },
    shortDescription: {
      type: String,
      required: true,
    },
    fullDescription: {
      type: String,
      required: true,
    },
    startingPrice: {
      type: Number,
      required: true,
    },
    estimatedDuration: {
      type: String,
      default: '3 - 5 Hours',
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    reviewCount: {
      type: Number,
      default: 150,
    },
    image: {
      type: String,
      required: true,
    },
    included: [{ type: String }],
    excluded: [{ type: String }],
    benefits: [{ type: String }],
    faqs: [faqSchema],
    availableAddons: [addonSchema],
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Service = mongoose.model('Service', serviceSchema);
