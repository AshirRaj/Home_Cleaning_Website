import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';

export const authenticateAdmin = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.admin_token) {
      token = req.cookies.admin_token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthenticated admin session. Access denied.',
        code: 'UNAUTHORIZED',
      });
    }

    const secret = process.env.JWT_SECRET || 'super_secret_production_jwt_key_sagarika_cleaning_2026';
    const decoded = jwt.verify(token, secret);

    const admin = await Admin.findById(decoded.id);
    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Admin account disabled or not found.',
        code: 'ACCOUNT_DISABLED',
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session token.',
      code: 'TOKEN_INVALID',
    });
  }
};

export const requireAdminRole = (req, res, next) => {
  if (!req.admin || (req.admin.role !== 'ADMIN' && req.admin.role !== 'SUPER_ADMIN')) {
    return res.status(403).json({
      success: false,
      message: 'Forbidden. Admin privileges required.',
      code: 'FORBIDDEN',
    });
  }
  next();
};

export const optionalAuthenticateAdmin = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.admin_token) {
      token = req.cookies.admin_token;
    }

    if (token) {
      const secret = process.env.JWT_SECRET || 'super_secret_production_jwt_key_sagarika_cleaning_2026';
      const decoded = jwt.verify(token, secret);
      const admin = await Admin.findById(decoded.id);
      if (admin && admin.isActive) {
        req.admin = admin;
      }
    }
  } catch {
    // Non-fatal for optional auth
  }
  next();
};
