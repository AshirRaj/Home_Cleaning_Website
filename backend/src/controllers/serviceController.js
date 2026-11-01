import { Service } from '../models/Service.js';
import { AuditLog } from '../models/AuditLog.js';

// Public: Get all active services
export const getServices = async (req, res, next) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ createdAt: -1 });
    return res.status(200).json(services);
  } catch (error) {
    next(error);
  }
};

// Admin: Get all services (including inactive ones)
export const getAdminServices = async (req, res, next) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    return res.status(200).json(services);
  } catch (error) {
    next(error);
  }
};

// Public/Admin: Get service by ID or Slug
export const getServiceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const service = await Service.findOne({
      $or: [{ id }, { slug: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: `Service with ID "${id}" not found.`,
        code: 'NOT_FOUND',
      });
    }

    return res.status(200).json(service);
  } catch (error) {
    next(error);
  }
};

// Admin: Create new service
export const createService = async (req, res, next) => {
  try {
    const serviceData = req.body;

    if (!serviceData.name || !serviceData.shortDescription || !serviceData.fullDescription || !serviceData.startingPrice) {
      return res.status(400).json({
        success: false,
        message: 'Name, short description, full description, and starting price are required.',
        code: 'VALIDATION_ERROR',
      });
    }

    // Auto-generate id and slug if missing
    const generatedSlug = serviceData.slug
      ? serviceData.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
      : serviceData.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

    const generatedId = serviceData.id
      ? serviceData.id.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
      : generatedSlug;

    // Check uniqueness
    const existing = await Service.findOne({
      $or: [{ id: generatedId }, { slug: generatedSlug }],
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: `A service with ID/slug "${generatedSlug}" already exists. Please choose a different name or slug.`,
        code: 'DUPLICATE_SERVICE',
      });
    }

    const newService = new Service({
      id: generatedId,
      slug: generatedSlug,
      name: serviceData.name.trim(),
      category: serviceData.category || 'Full House',
      iconName: serviceData.iconName || 'Sparkles',
      badge: serviceData.badge || '',
      shortDescription: serviceData.shortDescription,
      fullDescription: serviceData.fullDescription,
      startingPrice: Number(serviceData.startingPrice),
      estimatedDuration: serviceData.estimatedDuration || '3 - 5 Hours',
      rating: Number(serviceData.rating) || 4.8,
      reviewCount: Number(serviceData.reviewCount) || 0,
      image: serviceData.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
      included: Array.isArray(serviceData.included) ? serviceData.included.filter(Boolean) : [],
      excluded: Array.isArray(serviceData.excluded) ? serviceData.excluded.filter(Boolean) : [],
      benefits: Array.isArray(serviceData.benefits) ? serviceData.benefits.filter(Boolean) : [],
      faqs: Array.isArray(serviceData.faqs) ? serviceData.faqs.filter(f => f.q && f.a) : [],
      availableAddons: Array.isArray(serviceData.availableAddons)
        ? serviceData.availableAddons.map((addon) => ({
            id: addon.id || addon.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `addon-${Date.now()}`,
            name: addon.name,
            description: addon.description || '',
            price: Number(addon.price) || 0,
            icon: addon.icon || 'Plus',
            isActive: addon.isActive !== false,
          }))
        : [],
      isActive: serviceData.isActive !== false,
    });

    await newService.save();

    // Audit Log
    if (req.admin) {
      await AuditLog.create({
        adminId: String(req.admin._id),
        adminEmail: req.admin.email,
        action: 'CREATE_SERVICE',
        resourceType: 'SERVICE',
        resourceId: newService.id,
        metadata: { serviceName: newService.name },
      }).catch(() => {});
    }

    return res.status(201).json(newService);
  } catch (error) {
    next(error);
  }
};

// Admin: Update service
export const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const service = await Service.findOne({
      $or: [{ id }, { slug: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: `Service with ID "${id}" not found.`,
        code: 'NOT_FOUND',
      });
    }

    if (updateData.name) service.name = updateData.name.trim();
    if (updateData.category) service.category = updateData.category;
    if (updateData.iconName) service.iconName = updateData.iconName;
    if (updateData.badge !== undefined) service.badge = updateData.badge;
    if (updateData.shortDescription) service.shortDescription = updateData.shortDescription;
    if (updateData.fullDescription) service.fullDescription = updateData.fullDescription;
    if (updateData.startingPrice !== undefined) service.startingPrice = Number(updateData.startingPrice);
    if (updateData.estimatedDuration) service.estimatedDuration = updateData.estimatedDuration;
    if (updateData.rating !== undefined) service.rating = Number(updateData.rating);
    if (updateData.reviewCount !== undefined) service.reviewCount = Number(updateData.reviewCount);
    if (updateData.image) service.image = updateData.image;

    if (Array.isArray(updateData.included)) service.included = updateData.included.filter(Boolean);
    if (Array.isArray(updateData.excluded)) service.excluded = updateData.excluded.filter(Boolean);
    if (Array.isArray(updateData.benefits)) service.benefits = updateData.benefits.filter(Boolean);
    if (Array.isArray(updateData.faqs)) service.faqs = updateData.faqs.filter(f => f.q && f.a);

    if (Array.isArray(updateData.availableAddons)) {
      service.availableAddons = updateData.availableAddons.map((addon) => ({
        id: addon.id || addon.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `addon-${Date.now()}`,
        name: addon.name,
        description: addon.description || '',
        price: Number(addon.price) || 0,
        icon: addon.icon || 'Plus',
        isActive: addon.isActive !== false,
      }));
    }

    if (updateData.isActive !== undefined) service.isActive = Boolean(updateData.isActive);

    await service.save();

    // Audit Log
    if (req.admin) {
      await AuditLog.create({
        adminId: String(req.admin._id),
        adminEmail: req.admin.email,
        action: 'UPDATE_SERVICE',
        resourceType: 'SERVICE',
        resourceId: service.id,
        metadata: { serviceName: service.name },
      }).catch(() => {});
    }

    return res.status(200).json(service);
  } catch (error) {
    next(error);
  }
};

// Admin: Delete service
export const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;

    const service = await Service.findOneAndDelete({
      $or: [{ id }, { slug: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: `Service with ID "${id}" not found.`,
        code: 'NOT_FOUND',
      });
    }

    // Audit Log
    if (req.admin) {
      await AuditLog.create({
        adminId: String(req.admin._id),
        adminEmail: req.admin.email,
        action: 'DELETE_SERVICE',
        resourceType: 'SERVICE',
        resourceId: service.id,
        metadata: { serviceName: service.name },
      }).catch(() => {});
    }

    return res.status(200).json({
      success: true,
      message: `Service "${service.name}" (${service.id}) has been deleted successfully.`,
      id: service.id,
    });
  } catch (error) {
    next(error);
  }
};
