import type { App } from "firebase-admin/app";
import type { Firestore } from "firebase-admin/firestore";

// Desactivamos Firebase por completo para usar exclusivamente SQLite local
export const firestore: Firestore | null = null;
export const firebaseEnabled = false;
