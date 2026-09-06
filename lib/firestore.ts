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

type NewCategory = Omit<Category, "id" | "createdAt">;
type NewAccount = Omit<Account, "id" | "createdAt">;
type NewBudget = Omit<Budget, "id" | "createdAt">;
type NewTransaction = Omit<Transaction, "id" | "createdAt">;

async function readCollection<T extends { id: string }>(collectionName: string): Promise<T[]> {
  const collectionReference = collection(db, collectionName);
  const snapshot = await getDocs(collectionReference);

  return snapshot.docs.map((documentSnapshot) => ({
    id: documentSnapshot.id,
    ...documentSnapshot.data(),
  }) as T);
}

export async function getCategories(): Promise<Category[]> {
  return readCollection<Category>("categories");
}

export async function getAccounts(): Promise<Account[]> {
  return readCollection<Account>("accounts");
}

export async function getBudgets(): Promise<Budget[]> {
  return readCollection<Budget>("budgets");
}

export async function getTransactions(maximumTransactions = 250): Promise<Transaction[]> {
  const transactionsQuery = query(
    collection(db, "transactions"),
    orderBy("date", "desc"),
    limit(maximumTransactions),
  );
  const snapshot = await getDocs(transactionsQuery);

  return snapshot.docs.map((documentSnapshot) => ({
    id: documentSnapshot.id,
    ...documentSnapshot.data(),
  }) as Transaction);
}

export async function createCategory(category: NewCategory) {
  const categoryData = {
    ...category,
    createdAt: serverTimestamp(),
  };

  return addDoc(collection(db, "categories"), categoryData);
}

export async function updateCategory(categoryId: string, category: Partial<NewCategory>) {
  const categoryReference = doc(db, "categories", categoryId);
  return updateDoc(categoryReference, category);
}

export async function deleteCategory(categoryId: string) {
  const transactionsUsingCategoryQuery = query(
    collection(db, "transactions"),
    where("categoryId", "==", categoryId),
    limit(1),
  );
  const transactionsUsingCategory = await getDocs(transactionsUsingCategoryQuery);

  if (!transactionsUsingCategory.empty) {
    throw new Error("This category is used by existing transactions.");
  }

  const categoryReference = doc(db, "categories", categoryId);
  return deleteDoc(categoryReference);
}

export async function createAccount(account: NewAccount) {
  const accountData = {
    ...account,
    createdAt: serverTimestamp(),
  };

  return addDoc(collection(db, "accounts"), accountData);
}

export async function createBudget(budget: NewBudget) {
  const budgetData = {
    ...budget,
    createdAt: serverTimestamp(),
  };

  return addDoc(collection(db, "budgets"), budgetData);
}

export async function createTransaction(transaction: NewTransaction) {
  const transactionData = {
    ...transaction,
    createdAt: serverTimestamp(),
  };

  return addDoc(collection(db, "transactions"), transactionData);
}

export const defaultCategories: Omit<Category, "id" | "createdAt">[] = [
  ...[
    "Groceries",
    "Food",
    "Housing",
    "Transport",
    "Shopping",
    "Entertainment",
    "Bills",
    "Health",
    "Education",
    "Travel",
    "Other",
  ].map((name) => ({
    name,
    type: "expense" as const,
    icon: "tag",
    color: "#295b55",
  })),
  ...["Salary", "Freelance", "Investment", "Gift", "Other"].map((name) => ({
    name,
    type: "income" as const,
    icon: "trending-up",
    color: "#2b8069",
  })),
];