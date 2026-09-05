import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/app/firebase/firebase";
import type { Account, Budget, Category, Transaction } from "@/lib/types";

const readCollection = async <T extends { id: string }>(name: string) => {
  const snapshot = await getDocs(collection(db, name));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as T);
};

export const getCategories = () => readCollection<Category>("categories");
export const getAccounts = () => readCollection<Account>("accounts");
export const getBudgets = () => readCollection<Budget>("budgets");

export async function getTransactions(max = 250) {
  const snapshot = await getDocs(
    query(collection(db, "transactions"), orderBy("date", "desc"), limit(max)),
  );
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Transaction);
}

export async function createCategory(category: Omit<Category, "id" | "createdAt">) {
  return addDoc(collection(db, "categories"), { ...category, createdAt: serverTimestamp() });
}

export async function updateCategory(id: string, category: Partial<Category>) {
  const data = { ...category };
  delete data.id;
  delete data.createdAt;
  return updateDoc(doc(db, "categories", id), data);
}

export async function deleteCategory(id: string) {
  const transactions = await getDocs(
    query(collection(db, "transactions"), where("categoryId", "==", id), limit(1)),
  );
  if (!transactions.empty) throw new Error("This category is used by existing transactions.");
  return deleteDoc(doc(db, "categories", id));
}

export async function createAccount(account: Omit<Account, "id" | "createdAt">) {
  return addDoc(collection(db, "accounts"), { ...account, createdAt: serverTimestamp() });
}

export async function createBudget(budget: Omit<Budget, "id" | "createdAt">) {
  return addDoc(collection(db, "budgets"), { ...budget, createdAt: serverTimestamp() });
}

export async function createTransaction(transaction: Omit<Transaction, "id" | "createdAt">) {
  return addDoc(collection(db, "transactions"), { ...transaction, createdAt: serverTimestamp() });
}

export const defaultCategories: Omit<Category, "id" | "createdAt">[] = [
  ...["Groceries", "Food", "Housing", "Transport", "Shopping", "Entertainment", "Bills", "Health", "Education", "Travel", "Other"].map((name) => ({ name, type: "expense" as const, icon: "tag", color: "#295b55" })),
  ...["Salary", "Freelance", "Investment", "Gift", "Other"].map((name) => ({ name, type: "income" as const, icon: "trending-up", color: "#2b8069" })),
];