const { randomUUID } = require('crypto');

const User = require('../models/User.js');
const Organization = require('../models/Organization.js');
const { generatePasswordHash, validatePassword } = require('../utils/password.js');

class UserService {
  static async list() {
    try {
      return User.find();
    } catch (err) {
      throw new Error(`Database error while listing users: ${err}`);
    }
  }

  static async get(id) {
    try {
      return User.findOne({ _id: id }).populate('organization').exec();
    } catch (err) {
      throw new Error(`Database error while getting the user by their ID: ${err}`);
    }
  }

  static async getByEmail(email) {
    try {
      return User.findOne({ email }).exec();
    } catch (err) {
      throw new Error(`Database error while getting the user by their email: ${err}`);
    }
  }

  static async update(id, data) {
    try {
      return User.findOneAndUpdate({ _id: id }, data, { new: true, upsert: false });
    } catch (err) {
      throw new Error(`Database error while updating user ${id}: ${err}`);
    }
  }

  static async delete(id) {
    try {
      const result = await User.deleteOne({ _id: id }).exec();
      return (result.deletedCount === 1);
    } catch (err) {
      throw new Error(`Database error while deleting user ${id}: ${err}`);
    }
  }

  static async authenticateWithPassword(email, password) {
    if (!email) throw new Error('Email is required');
    if (!password) throw new Error('Password is required');

    try {
      console.log('Looking up user with email:', email);
      const user = await User.findOne({email}).exec();
      console.log('User lookup result:', user ? 'Found' : 'Not found');

      if (!user) return null;

      console.log('Validating password for user:', user._id);
      const passwordValid = await validatePassword(password, user.password);
      console.log('Password validation result:', passwordValid ? 'Valid' : 'Invalid');

      if (!passwordValid) return null;

      user.lastLoginAt = Date.now();
      const updatedUser = await user.save();
      console.log('User successfully authenticated:', updatedUser._id);
      return updatedUser;
    } catch (err) {
      console.error('Authentication error:', err);
      throw new Error(`Database error while authenticating user ${email} with password: ${err}`);
    }
  }

  static async create({ email, password, name = '' }) {
    if (!email) throw new Error('Email is required');
    if (!password) throw new Error('Password is required');
    if (!name) throw new Error('Name is required');

    const existingUser = await UserService.getByEmail(email);
    if (existingUser) throw new Error('User with this email already exists');

    const hash = await generatePasswordHash(password);

    try {
      // Create a new organization for the user
      const organization = new Organization({
        name: 'My Organization', // Default name that can be changed later
      });
      await organization.save();

      const user = new User({
        email,
        password: hash,
        name,
        organization: organization._id,
        role: 'Admin', // First user is always admin
      });

      await user.save();

      // Populate organization details
      await user.populate('organization');

      return user;
    } catch (err) {
      throw new Error(`Database error while creating new user: ${err}`);
    }
  }

  static async setPassword(user, password) {
    if (!password) throw new Error('Password is required');
    user.password = await generatePasswordHash(password); // eslint-disable-line

    try {
      if (!user.isNew) {
        await user.save();
      }

      return user;
    } catch (err) {
      throw new Error(`Database error while setting user password: ${err}`);
    }
  }
}

module.exports = UserService;