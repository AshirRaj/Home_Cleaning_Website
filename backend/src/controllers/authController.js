import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin.js';
import { AuditLog } from '../models/AuditLog.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
        code: 'VALIDATION_ERROR',
      });
    }

    const emailLower = email.toLowerCase().trim();

    // Query admin with passwordHash included
    const admin = await Admin.findOne({ email: emailLower }).select('+passwordHash');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
        code: 'INVALID_CREDENTIALS',
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
        code: 'INVALID_CREDENTIALS',
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your admin account has been deactivated.',
        code: 'ACCOUNT_DISABLED',
      });
    }

    // Update lastLoginAt
    admin.lastLoginAt = new Date();
    await admin.save();

    // Sign JWT Token
    const secret = process.env.JWT_SECRET || 'super_secret_production_jwt_key_sagarika_cleaning_2026';
    const token = jwt.sign({ id: admin._id, email: admin.email, role: admin.role }, secret, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    // Set HTTP-Only Cookie
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Audit log
    await AuditLog.create({
      adminId: String(admin._id),
      adminEmail: admin.email,
      action: 'ADMIN_LOGIN',
      resourceType: 'ADMIN',
      resourceId: String(admin._id),
      ipAddress: req.ip,
    }).catch(() => { });

    const userResponse = {
      id: String(admin._id),
      name: admin.name,
      email: admin.email,
      role: admin.role,
    };

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse,
      data: {
        admin: userResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie('admin_token');
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentAdmin = async (req, res, next) => {
  try {
    const admin = req.admin;
    const userResponse = {
      id: String(admin._id),
      name: admin.name,
      email: admin.email,
      role: admin.role,
    };

    return res.status(200).json({
      success: true,
      user: userResponse,
      data: {
        admin: userResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, email } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Both current password and new password are required.',
        code: 'VALIDATION_ERROR',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.',
        code: 'VALIDATION_ERROR',
      });
    }

    let admin = req.admin;
    if (!admin) {
      const targetEmail = (email || 'admin@sagrika.com').toLowerCase().trim();
      admin = await Admin.findOne({ email: targetEmail }).select('+passwordHash');
    } else {
      admin = await Admin.findById(admin._id).select('+passwordHash');
    }

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin account not found.',
        code: 'NOT_FOUND',
      });
    }

    const isMatch = await admin.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'The current/previous password you entered is incorrect.',
        code: 'INVALID_CREDENTIALS',
      });
    }

    admin.passwordHash = await bcrypt.hash(newPassword, 10);
    await admin.save();

    await AuditLog.create({
      adminId: String(admin._id),
      adminEmail: admin.email,
      action: 'ADMIN_CHANGE_PASSWORD',
      resourceType: 'ADMIN',
      resourceId: String(admin._id),
      ipAddress: req.ip,
    }).catch(() => { });

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully in database.',
    });
  } catch (error) {
    next(error);
  }
};
