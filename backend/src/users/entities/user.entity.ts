import { Schema, Document } from 'mongoose';

// 使用 Mongoose 的 Document 接口定义 IUser
export interface IUser extends Document {
  email: string;
  password: string;
  role: string;
}

// 定义 Mongoose 用户模型
export const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Submitter', 'Moderator', 'Analyst'], default: 'Submitter' },
});
