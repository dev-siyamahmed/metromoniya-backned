import { Document,} from 'mongoose';
import { ROLE } from '../constance/Role';

export interface TUser extends Document {
  _id: string;

  // Basic Account Info
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: TUserRole;
  profilePicture?: string | '';
  status: 'active' | 'inactive' | 'blocked' | 'deleted';
  verified: boolean;

  // Account type
  accountFor: 'self' | 'son' | 'daughter' | 'relative' | 'other';

  // Personal Details
  gender: 'male' | 'female' | 'other' | 'none';
  dob?: Date;
  height?: string; // Example: "5ft 6in"
  country?: string;
  city?: string;
  residentialStatus?: string;
  nationality?: string | null;
  address?: string | null;

  // Career Details
  education?: string;
  workExperience?: string;
  occupation?: string;
  income?: number;

  // Social Details
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  motherTongue?: string;
  religion?: string | null;
  sect?: string;
  jammat?: string;
  caste?: string;
  aboutMe?: string | null;
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// export interface TUserModel extends Model<TUser> {
//   findByEmail: (email: string) => Promise<TUser | null>;
// }

export type TUserRole = keyof typeof ROLE;
