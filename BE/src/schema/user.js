import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    profile_image: { type: String },
    role: { type: String, required: true, enum: ['ADMIN', 'USER'] },
    password: { type: String, required: true, select: false },
    last_login: { type: Date, default: null },
    email_verified: { type: Boolean, default: false },
    status: { type: String, default: 'ACTIVE', enum: ['ACTIVE', 'SUSPENDED', 'PENDING'] },
  },
  {
    timestamps: true,
    collection: 'user'
  },
);

const User = mongoose.model("User", userSchema);
export default User;
