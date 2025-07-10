import Account, { IAccount } from "../schema/account";

export const createAccount = async (account: IAccount) => {
  const newAccount = new Account(account);
  await newAccount.save();
  return newAccount;
};

export const getAccountByEmail = async (email: string) => {
  const account = await Account.findOne({ email });
  return account;
};

export const getAccountByUsername = async (username: string) => {
  const account = await Account.findOne({ username });
  return account;
};

export const getAccountById = async (id: string) => {
  const account = await Account.findById(id);
  return account;
};

export const updateAccount = async (id: string, account: IAccount) => {
  const updatedAccount = await Account.findByIdAndUpdate(id, account, {
    new: true,
  });
  return updatedAccount;
};

export const deleteAccount = async (id: string) => {
  const deletedAccount = await Account.findByIdAndDelete(id);
  return deletedAccount;
};

export const getAccounts = async (page: number, limit: number) => {
  const offset = (page - 1) * limit;
  const accounts = await Account.find()
    .skip(offset)
    .limit(limit)
    .sort({ createdAt: -1 });
  return accounts;
};
