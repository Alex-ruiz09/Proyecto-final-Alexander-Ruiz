// models/User.js
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  nombre: { type: String, required: [true, 'El nombre es requerido'], trim: true },
  email: { type: String, required: [true, 'El email es requerido'], unique: true, trim: true, lowercase: true },
  contraseña: { type: String, required: [true, 'La contraseña es requerida'] },
  rol: { type: String, enum: ['admin', 'profesor', 'coordinador', 'secretaria', 'rector'], default: 'profesor' },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model("User", userSchema);