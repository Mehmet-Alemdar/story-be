const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // Temel bilgiler
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },

  // Sosyal giriş bilgileri
  authProvider: { type: String, default: 'email' }, // örn: "google", "apple", "email"
  providerId: { type: String },
  profilePhoto: { type: String },

  // Premium üyelik bilgileri
  isPremium: { type: Boolean, default: false },
  premiumStartDate: { type: Date },
  premiumEndDate: { type: Date },
  paymentProvider: { type: String }, // örn: "google_play" veya "app_store"
  paymentTransactionId: { type: String },
  subscriptionPlan: { type: String, default: 'basic' },

  // Cihaz & bildirim bilgileri
  deviceId: { type: String },
  fcmToken: { type: String },

}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema);
