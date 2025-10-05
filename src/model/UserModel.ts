import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { TUser } from '../interface/UserInterface';

const UserSchema: Schema<TUser> = new Schema(
    {
    // Basic Info
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    phoneNumber: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    profilePicture: { type: String, default: null },

    // Account Type
    accountFor: {
      type: String,
      enum: ["self", "son", "daughter", "relative", "other"],
      default: "self",
    },

    // Personal Details
    gender: { type: String, enum: ["male", "female", "other", "none"], default: "none" },
    dob: { type: Date, default: null },
    height: { type: String, default: null }, // "5ft 6in"
    country: { type: String, default: null },
    city: { type: String, default: null },
    residentialStatus: { type: String, default: null }, // "own" / "rent"

    // Career Details
    education: { type: String, default: null },
    workExperience: { type: String, default: null },
    occupation: { type: String, default: null },
    income: { type: Number, default: 0 },

    // Social Details
    maritalStatus: {
      type: String,
      enum: ["single", "married", "divorced", "widowed"],
      default: "single",
    },
    motherTongue: { type: String, default: null },
    religion: { type: String, default: null },
    sect: { type: String, default: null },
    jammat: { type: String, default: null },
    caste: { type: String, default: null },

    // Others
    role: { type: String, enum: ["user", "admin"], default: "user" },
    status: { type: String, enum: ["active", "inactive", "delete" , "blocked"], default: "active" },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Password hashing middleware
UserSchema.pre('save', async function (next) {
    if (this.isModified('password') && this.password) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Password validation method
UserSchema.methods.validatePassword = async function (password: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(password, this.password);
};


// Static method to find by email
UserSchema.statics.findByEmail = async function (email: string): Promise<TUser | null> {
    return this.findOne({ email });
};

// Create models with read/write separation for performance optimization
export const UserModel = model<TUser>('User', UserSchema);