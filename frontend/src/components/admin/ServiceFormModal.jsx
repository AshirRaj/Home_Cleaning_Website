import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { serviceFormSchema } from '../../utils/validation';
import { Button } from '../common/Button';
import {
  X,
  Plus,
  Trash2,
  Sparkles,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORY_OPTIONS = [
  'Full House',
  'Targeted Area',
  'Specialized',
  'Furniture Care',
  'Commercial',
  'Custom',
];

const ICON_OPTIONS = [
  'Sparkles',
  'Home',
  'Bath',
  'ChefHat',
  'Truck',
  'Armchair',
  'Layers',
  'Sliders',
  'Shield',
  'Bed',
  'Utensils',
];

export const ServiceFormModal = ({ isOpen, onClose, onSubmit, initialData = null, isSubmitting = false }) => {
  const [activeTab, setActiveTab] = useState('general');

  const defaultValues = {
    id: initialData?.id || '',
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    category: initialData?.category || 'Full House',
    iconName: initialData?.iconName || 'Sparkles',
    badge: initialData?.badge || '',
    shortDescription: initialData?.shortDescription || '',
    fullDescription: initialData?.fullDescription || '',
    startingPrice: initialData?.startingPrice ?? 2499,
    estimatedDuration: initialData?.estimatedDuration || '4 - 6 Hours',
    rating: initialData?.rating ?? 4.9,
    reviewCount: initialData?.reviewCount ?? 0,
    image: initialData?.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    included: initialData?.included?.length ? initialData.included : ['Deep scrubbing of floors & tiles'],
    excluded: initialData?.excluded?.length ? initialData.excluded : ['Paint stain removal from walls'],
    benefits: initialData?.benefits?.length ? initialData.benefits : ['Hospital-grade disinfectants used'],
    faqs: initialData?.faqs?.length
      ? initialData.faqs
      : [{ q: 'Do I need to supply cleaning products?', a: 'No, our team brings all specialized equipment and eco-friendly products.' }],
    availableAddons: initialData?.availableAddons?.length
      ? initialData.availableAddons
      : [{ id: 'extra-bath', name: 'Extra Bathroom Cleaning', price: 450, icon: 'Bath' }],
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(serviceFormSchema),
    defaultValues,
  });

  // Dynamic Array Fields
  const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({
    control,
    name: 'faqs',
  });

  const { fields: addonFields, append: appendAddon, remove: removeAddon } = useFieldArray({
    control,
    name: 'availableAddons',
  });

  const [includedInput, setIncludedInput] = useState('');
  const [excludedInput, setExcludedInput] = useState('');
  const [benefitInput, setBenefitInput] = useState('');

  const includedList = watch('included') || [];
  const excludedList = watch('excluded') || [];
  const benefitList = watch('benefits') || [];
  const watchImage = watch('image');

  useEffect(() => {
    if (isOpen) {
      reset(defaultValues);
      setActiveTab('general');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  const addIncludedItem = () => {
    if (!includedInput.trim()) return;
    setValue('included', [...includedList, includedInput.trim()], { shouldValidate: true });
    setIncludedInput('');
  };

  const removeIncludedItem = (index) => {
    setValue(
      'included',
      includedList.filter((_, i) => i !== index),
      { shouldValidate: true }
    );
  };

  const addExcludedItem = () => {
    if (!excludedInput.trim()) return;
    setValue('excluded', [...excludedList, excludedInput.trim()]);
    setExcludedInput('');
  };

  const removeExcludedItem = (index) => {
    setValue(
      'excluded',
      excludedList.filter((_, i) => i !== index)
    );
  };

  const addBenefitItem = () => {
    if (!benefitInput.trim()) return;
    setValue('benefits', [...benefitList, benefitInput.trim()]);
    setBenefitInput('');
  };

  const removeBenefitItem = (index) => {
    setValue(
      'benefits',
      benefitList.filter((_, i) => i !== index)
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">
                  {initialData ? 'Edit Cleaning Service' : 'Create New Service'}
                </h3>
                <p className="text-xs text-slate-400">
                  {initialData ? `Editing service: ${initialData.name}` : 'Fill in all service details to publish to catalog'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2 shrink-0 overflow-x-auto">
            {[
              { id: 'general', label: 'Basic Info' },
              { id: 'descriptions', label: 'Descriptions & Image' },
              { id: 'lists', label: 'Included & Excluded' },
              { id: 'benefits_faqs', label: 'Benefits & FAQs' },
              { id: 'addons', label: 'Available Add-ons' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-teal-600 text-teal-700 bg-white shadow-xs'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit(handleFormSubmit)} className="flex-1 overflow-y-auto p-6">
            {/* TAB 1: GENERAL INFO */}
            {activeTab === 'general' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Service Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('name')}
                      placeholder="e.g. Deep Home Cleaning"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:bg-white"
                    />
                    {errors.name && <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Category <span className="text-rose-500">*</span>
                    </label>
                    <select
                      {...register('category')}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:bg-white"
                    >
                      {CATEGORY_OPTIONS.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    {errors.category && <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.category.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Starting Price (₹) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      {...register('startingPrice')}
                      placeholder="2499"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:bg-white"
                    />
                    {errors.startingPrice && <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.startingPrice.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Estimated Duration <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('estimatedDuration')}
                      placeholder="e.g. 4 - 6 Hours"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:bg-white"
                    />
                    {errors.estimatedDuration && <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.estimatedDuration.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Badge / Tag
                    </label>
                    <input
                      type="text"
                      {...register('badge')}
                      placeholder="e.g. Most Popular"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Icon Name
                    </label>
                    <select
                      {...register('iconName')}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:bg-white"
                    >
                      {ICON_OPTIONS.map((ico) => (
                        <option key={ico} value={ico}>
                          {ico}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Rating (1 - 5)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      {...register('rating')}
                      placeholder="4.9"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Review Count
                    </label>
                    <input
                      type="number"
                      {...register('reviewCount')}
                      placeholder="482"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: DESCRIPTIONS & IMAGE */}
            {activeTab === 'descriptions' && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Short Description <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    {...register('shortDescription')}
                    placeholder="Intensive top-to-bottom thorough cleaning for your entire home."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  />
                  {errors.shortDescription && (
                    <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.shortDescription.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Full Detailed Description <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    {...register('fullDescription')}
                    placeholder="Our Deep Home Cleaning is a high-grade, comprehensive cleaning package designed to sanitize, degrease, and remove stubborn dirt..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  />
                  {errors.fullDescription && (
                    <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.fullDescription.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Cover Image URL <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="url"
                    {...register('image')}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  />
                  {errors.image && <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.image.message}</p>}

                  {/* Image Preview Thumbnail */}
                  {watchImage && (
                    <div className="mt-3 flex items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <img
                        src={watchImage}
                        alt="Preview"
                        className="w-24 h-16 object-cover rounded-lg border border-slate-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-700">Image Preview</p>
                        <p className="text-[11px] text-slate-500">Live preview of service banner image</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: INCLUDED & EXCLUDED */}
            {activeTab === 'lists' && (
              <div className="space-y-6">
                {/* Included Items */}
                <div>
                  <label className="block text-xs font-bold text-teal-700 uppercase mb-2">
                    What is Included? <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={includedInput}
                      onChange={(e) => setIncludedInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addIncludedItem();
                        }
                      }}
                      placeholder="e.g. Deep scrubbing of all home floors & tiles"
                      className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
                    />
                    <Button type="button" onClick={addIncludedItem} variant="secondary" className="text-xs py-2 px-3">
                      <Plus className="w-4 h-4 mr-1" /> Add
                    </Button>
                  </div>
                  {errors.included && <p className="text-xs text-rose-500 mb-2 font-semibold">{errors.included.message}</p>}
                  <ul className="space-y-2">
                    {includedList.map((item, idx) => (
                      <li key={idx} className="flex items-center justify-between p-2.5 bg-emerald-50/60 border border-emerald-200/60 rounded-xl text-xs font-medium text-emerald-900">
                        <span className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" /> {item}
                        </span>
                        <button type="button" onClick={() => removeIncludedItem(idx)} className="text-rose-500 hover:text-rose-700 p-1">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Excluded Items */}
                <div className="pt-4 border-t border-slate-200">
                  <label className="block text-xs font-bold text-rose-700 uppercase mb-2">
                    What is Excluded?
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={excludedInput}
                      onChange={(e) => setExcludedInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addExcludedItem();
                        }
                      }}
                      placeholder="e.g. Outdoor garden or exterior roof cleaning"
                      className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-rose-500"
                    />
                    <Button type="button" onClick={addExcludedItem} variant="outline" className="text-xs py-2 px-3">
                      <Plus className="w-4 h-4 mr-1" /> Add
                    </Button>
                  </div>
                  <ul className="space-y-2">
                    {excludedList.map((item, idx) => (
                      <li key={idx} className="flex items-center justify-between p-2.5 bg-rose-50/60 border border-rose-200/60 rounded-xl text-xs font-medium text-rose-900">
                        <span>• {item}</span>
                        <button type="button" onClick={() => removeExcludedItem(idx)} className="text-rose-500 hover:text-rose-700 p-1">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 4: BENEFITS & FAQS */}
            {activeTab === 'benefits_faqs' && (
              <div className="space-y-6">
                {/* Benefits Manager */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Service Key Benefits
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={benefitInput}
                      onChange={(e) => setBenefitInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addBenefitItem();
                        }
                      }}
                      placeholder="e.g. Eliminates 99.9% of household bacteria"
                      className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
                    />
                    <Button type="button" onClick={addBenefitItem} variant="secondary" className="text-xs py-2 px-3">
                      <Plus className="w-4 h-4 mr-1" /> Add
                    </Button>
                  </div>
                  <ul className="space-y-2">
                    {benefitList.map((item, idx) => (
                      <li key={idx} className="flex items-center justify-between p-2.5 bg-slate-100 rounded-xl text-xs font-medium text-slate-800">
                        <span>★ {item}</span>
                        <button type="button" onClick={() => removeBenefitItem(idx)} className="text-rose-500 hover:text-rose-700 p-1">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* FAQs Manager */}
                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-bold text-slate-700 uppercase">
                      Frequently Asked Questions (FAQs)
                    </label>
                    <button
                      type="button"
                      onClick={() => appendFaq({ q: '', a: '' })}
                      className="text-xs text-teal-600 font-bold hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Q&A
                    </button>
                  </div>
                  <div className="space-y-3">
                    {faqFields.map((field, idx) => (
                      <div key={field.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-teal-700">FAQ #{idx + 1}</span>
                          <button type="button" onClick={() => removeFaq(idx)} className="text-rose-500 hover:text-rose-700 p-1">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          {...register(`faqs.${idx}.q`)}
                          placeholder="Question (e.g. Do I need to supply equipment?)"
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                        />
                        <textarea
                          rows={2}
                          {...register(`faqs.${idx}.a`)}
                          placeholder="Answer (e.g. No, our team brings all equipment...)"
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: AVAILABLE ADDONS */}
            {activeTab === 'addons' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase">Service Available Add-ons</h4>
                    <p className="text-[11px] text-slate-500">Add optional extras customers can select during booking</p>
                  </div>
                  <Button
                    type="button"
                    onClick={() => appendAddon({ id: `addon-${Date.now()}`, name: '', price: 399, icon: 'Plus' })}
                    variant="secondary"
                    className="text-xs py-1.5 px-3"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Add-on
                  </Button>
                </div>

                <div className="space-y-3">
                  {addonFields.map((field, idx) => (
                    <div key={field.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                      <div className="md:col-span-5">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Addon Name</label>
                        <input
                          type="text"
                          {...register(`availableAddons.${idx}.name`)}
                          placeholder="e.g. Inside Refrigerator Deep Clean"
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Price (₹)</label>
                        <input
                          type="number"
                          {...register(`availableAddons.${idx}.price`)}
                          placeholder="499"
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Icon</label>
                        <select
                          {...register(`availableAddons.${idx}.icon`)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                        >
                          {['Refrigerator', 'Flame', 'Square', 'Sun', 'Bath', 'Bed', 'Sparkles', 'Plus'].map((ico) => (
                            <option key={ico} value={ico}>
                              {ico}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeAddon(idx)}
                          className="text-rose-500 hover:text-rose-700 p-2 rounded-lg hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Footer */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isSubmitting}>
                {initialData ? 'Save Changes' : 'Create & Publish Service'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
