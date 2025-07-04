import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface IAccount {
  username: string;
  email: string;
  password: string;
}

const accountSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Hash password before saving
accountSchema.pre("save", async function (next) {
  const user = this as any;
  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

// Compare password method
accountSchema.methods.comparePassword = async function (candidate: string) {
  return await bcrypt.compare(candidate, this.password);
};
const Account = mongoose.model("Account", accountSchema);

export default Account;
