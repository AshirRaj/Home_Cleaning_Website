import { z } from 'zod';

export const customerDetailsSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  whatsApp: z.string().regex(/^[0-9]{10}$/, 'WhatsApp number must be 10 digits'),
  alternatePhone: z.string().optional(),
  specialInstructions: z.string().optional(),
  agreeTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the Terms and Conditions' }),
  }),
  agreeNotifications: z.boolean().optional(),
});

export const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  email: z.string().email('Please enter a valid email address'),
  addressLine: z.string().min(3, 'Address line is required'),
  apartmentUnit: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().optional().refine((val) => !val || /^[0-9]{6}$/.test(val), 'Postal code must be 6 digits'),
});

export const scheduleSchema = z.object({
  date: z.string().min(1, 'Please select a date'),
  timeSlot: z.string().min(1, 'Please select a time slot'),
});

export const adminLoginSchema = z.object({
  email: z.string().email('Please enter a valid admin email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

export const serviceFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Service name must be at least 3 characters'),
  slug: z.string().optional(),
  category: z.string().min(2, 'Category is required'),
  iconName: z.string().default('Sparkles'),
  badge: z.string().optional(),
  shortDescription: z.string().min(10, 'Short description must be at least 10 characters'),
  fullDescription: z.string().min(20, 'Full description must be at least 20 characters'),
  startingPrice: z.coerce.number().min(0, 'Starting price must be a non-negative number'),
  estimatedDuration: z.string().min(2, 'Estimated duration is required (e.g. 4 - 6 Hours)'),
  rating: z.coerce.number().min(1).max(5).default(4.9),
  reviewCount: z.coerce.number().min(0).default(0),
  image: z.string().min(5, 'Image URL is required'),
  included: z.array(z.string()).min(1, 'Please add at least one included feature'),
  excluded: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  faqs: z
    .array(
      z.object({
        q: z.string().min(3, 'Question is required'),
        a: z.string().min(3, 'Answer is required'),
      })
    )
    .optional(),
  availableAddons: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string().min(2, 'Addon name is required'),
        price: z.coerce.number().min(0, 'Price must be non-negative'),
        icon: z.string().default('Plus'),
      })
    )
    .optional(),
});
