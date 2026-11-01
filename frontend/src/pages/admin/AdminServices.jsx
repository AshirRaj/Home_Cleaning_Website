import { useState } from 'react';
import {
  useAdminServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
} from '../../hooks/useServices';
import { ServiceFormModal } from '../../components/admin/ServiceFormModal';
import { Button } from '../../components/common/Button';
import { formatCurrency } from '../../utils/formatters';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Sparkles,
  Star,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Filter,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminServices = () => {
  const { data: services, isLoading, isError, error } = useAdminServices();
  const createServiceMutation = useCreateService();
  const updateServiceMutation = useUpdateService();
  const deleteServiceMutation = useDeleteService();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deletingService, setDeletingService] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const categories = [
    'ALL',
    ...new Set(services?.map((s) => s.category).filter(Boolean) || []),
  ];

  const filteredServices = services?.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'ALL' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenCreateModal = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleSaveService = async (formData) => {
    try {
      if (editingService) {
        await updateServiceMutation.mutateAsync({
          id: editingService.id || editingService._id,
          data: formData,
        });
        setFeedbackMessage({ type: 'success', text: `Service "${formData.name}" updated successfully!` });
      } else {
        await createServiceMutation.mutateAsync(formData);
        setFeedbackMessage({ type: 'success', text: `Service "${formData.name}" created and published!` });
      }
      setIsModalOpen(false);
      setEditingService(null);
      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch (err) {
      console.error('Failed to save service:', err);
      setFeedbackMessage({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Failed to save service.',
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingService) return;
    try {
      await deleteServiceMutation.mutateAsync(deletingService.id || deletingService._id);
      setFeedbackMessage({
        type: 'success',
        text: `Service "${deletingService.name}" deleted successfully.`,
      });
      setDeletingService(null);
      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch (err) {
      console.error('Failed to delete service:', err);
      setFeedbackMessage({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Failed to delete service.',
      });
    }
  };

  const handleToggleActive = async (service) => {
    try {
      await updateServiceMutation.mutateAsync({
        id: service.id || service._id,
        data: { isActive: !service.isActive },
      });
      setFeedbackMessage({
        type: 'success',
        text: `Service "${service.name}" is now ${!service.isActive ? 'Active' : 'Disabled'}.`,
      });
      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-teal-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" /> Service Catalog Operations
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Services Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Create, configure, update pricing, add-ons, FAQs, and manage active service offerings.
          </p>
        </div>

        <Button onClick={handleOpenCreateModal} variant="primary" className="shadow-md shadow-teal-600/20">
          <Plus className="w-4 h-4 mr-2" /> Add New Service
        </Button>
      </div>

      {/* Feedback Toast Notification */}
      {feedbackMessage && (
        <div
          className={`p-4 rounded-xl text-sm font-semibold flex items-center justify-between shadow-sm ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span className="flex items-center gap-2">
            {feedbackMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertTriangle className="w-5 h-5 text-rose-600" />}
            {feedbackMessage.text}
          </span>
          <button onClick={() => setFeedbackMessage(null)} className="text-xs text-slate-500 hover:text-slate-900 font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Controls Bar (Search & Category Filter) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search services by name or keyword..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse h-64" />
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-2xl text-center">
          <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
          <h3 className="font-bold">Failed to load services</h3>
          <p className="text-xs text-rose-600 mt-1">{error?.message || 'Please check backend server connection.'}</p>
        </div>
      )}

      {/* Services Grid */}
      {!isLoading && !isError && (
        <>
          {filteredServices?.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No Services Found</h3>
              <p className="text-xs text-slate-500 mt-1">No services match your search or filter criteria.</p>
              <Button onClick={handleOpenCreateModal} variant="outline" className="mt-4 text-xs">
                <Plus className="w-4 h-4 mr-1" /> Create First Service
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices?.map((service) => (
                <motion.div
                  key={service.id || service._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
                >
                  {/* Image Banner */}
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                      <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold rounded-lg uppercase tracking-wider">
                        {service.category}
                      </span>
                      {service.badge && (
                        <span className="px-2.5 py-1 bg-teal-500 text-slate-950 text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-xs">
                          {service.badge}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleToggleActive(service)}
                      className={`absolute top-3 right-3 px-2.5 py-1 text-[10px] font-bold rounded-lg backdrop-blur-xs shadow-xs transition-all ${
                        service.isActive
                          ? 'bg-emerald-500/90 text-white'
                          : 'bg-rose-500/90 text-white'
                      }`}
                    >
                      {service.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-extrabold text-slate-900 text-base line-clamp-1">{service.name}</h3>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{service.shortDescription}</p>

                      <div className="mt-3 flex items-center justify-between text-xs text-slate-600 font-semibold pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{service.rating || 4.9}</span>
                          <span className="text-slate-400 font-normal">({service.reviewCount || 0})</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-500">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{service.estimatedDuration}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price & Action Footer */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Starting at</span>
                        <span className="text-lg font-extrabold text-teal-600">
                          {formatCurrency(service.startingPrice)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(service)}
                          className="p-2 text-slate-600 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-colors border border-slate-200"
                          title="Edit Service"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingService(service)}
                          className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-slate-200"
                          title="Delete Service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Service Form Modal */}
      <ServiceFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveService}
        initialData={editingService}
        isSubmitting={createServiceMutation.isPending || updateServiceMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      {deletingService && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Delete Service?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete service <strong className="text-slate-900">"{deletingService.name}"</strong>? This will remove it from the public catalog.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <Button variant="outline" onClick={() => setDeletingService(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteConfirm}
                isLoading={deleteServiceMutation.isPending}
              >
                Delete Permanently
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
