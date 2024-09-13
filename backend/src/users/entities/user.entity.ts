import { Schema, Document } from 'mongoose';

export interface UserDocument extends Document {
  email: string;
  password: string;
  role: string;
}

export const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Submitter', 'Moderator', 'Analyst'], default: 'Submitter' },
});
