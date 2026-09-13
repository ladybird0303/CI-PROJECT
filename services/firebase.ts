// =============================================================================
// Firebase Service — Firestore database for Smart Energy Meter
// =============================================================================

import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  Firestore,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: 'AIzaSyBTDR8E4LVj15lGxNcNJDyofEy3m5TvJcY',
  authDomain: 'smartenergymeter-681c7.firebaseapp.com',
  databaseURL: 'https://smartenergymeter-681c7-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'smartenergymeter-681c7',
  storageBucket: 'smartenergymeter-681c7.firebasestorage.app',
  messagingSenderId: '643610792467',
  appId: '1:643610792467:web:2d8b9ad116709d893565e6',
  measurementId: 'G-SHTSTWXMSM',
};

// --- Types ---
export interface EnergyReading {
  voltage: number;
  current: number;
  power: number;
  timestamp: Timestamp;
  relayStates: [boolean, boolean, boolean];
}

export interface RelayEvent {
  channel: number;
  state: boolean;
  source: 'app' | 'button' | 'threshold';
  timestamp: Timestamp;
  relayName?: string;
}

export interface UserSettings {
  unitPriceBDT: number;
  monthlyBudgetBDT: number;
  monthlyBudgetKWh: number;
  powerThreshold: number;
  relayNames: [string, string, string];
  autoRelayCutoffOnTheft: boolean;
  updatedAt: Timestamp;
}

export interface DailySummary {
  date: string;
  totalEnergyWh: number;
  peakPower: number;
  avgVoltage: number;
  relayOnTimeMinutes: number;
  readingCount: number;
}

// --- Singleton ---
let app: FirebaseApp | null = null;
let db: Firestore | null = null;

export function initFirebase(): void {
  if (!app) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log('[FIREBASE] Initialized successfully');
  }
}

function getDb(): Firestore {
  if (!db) throw new Error('Firebase not initialized. Call initFirebase() first.');
  return db;
}

// --- Energy Readings ---
export async function saveEnergyReading(
  voltage: number, current: number, power: number,
  relayStates: [boolean, boolean, boolean],
): Promise<string> {
  const db = getDb();
  const docRef = await addDoc(collection(db, 'energy_readings'), {
    voltage, current, power, relayStates, timestamp: Timestamp.now(),
  });
  return docRef.id;
}

export async function getRecentReadings(count: number = 50): Promise<EnergyReading[]> {
  const db = getDb();
  const q = query(collection(db, 'energy_readings'), orderBy('timestamp', 'desc'), limit(count));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data() as EnergyReading);
}

export async function getReadingsByDateRange(startDate: Date, endDate: Date): Promise<EnergyReading[]> {
  const db = getDb();
  const q = query(
    collection(db, 'energy_readings'),
    where('timestamp', '>=', Timestamp.fromDate(startDate)),
    where('timestamp', '<=', Timestamp.fromDate(endDate)),
    orderBy('timestamp', 'asc'),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data() as EnergyReading);
}

// --- Relay Events ---
export async function logRelayEvent(
  channel: number, state: boolean, source: 'app' | 'button' | 'threshold', relayName?: string,
): Promise<string> {
  const db = getDb();
  const docRef = await addDoc(collection(db, 'relay_events'), {
    channel, state, source, relayName: relayName || `Load ${channel}`, timestamp: Timestamp.now(),
  });
  return docRef.id;
}

export async function getRecentRelayEvents(count: number = 50): Promise<RelayEvent[]> {
  const db = getDb();
  const q = query(collection(db, 'relay_events'), orderBy('timestamp', 'desc'), limit(count));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data() as RelayEvent);
}

// --- User Settings ---
export async function saveUserSettings(settings: Omit<UserSettings, 'updatedAt'>): Promise<void> {
  const db = getDb();
  await setDoc(doc(db, 'settings', 'user_config'), { ...settings, updatedAt: Timestamp.now() });
}

export async function loadUserSettings(): Promise<UserSettings | null> {
  const db = getDb();
  const snapshot = await getDoc(doc(db, 'settings', 'user_config'));
  return snapshot.exists() ? (snapshot.data() as UserSettings) : null;
}

// --- Daily Summaries ---
export async function saveDailySummary(summary: DailySummary): Promise<void> {
  const db = getDb();
  await setDoc(doc(db, 'daily_summaries', summary.date), summary);
}

export async function getDailySummaries(count: number = 30): Promise<DailySummary[]> {
  const db = getDb();
  const q = query(collection(db, 'daily_summaries'), orderBy('date', 'desc'), limit(count));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data() as DailySummary);
}

// --- Database Maintenance ---
export async function deleteAllData(): Promise<void> {
  const db = getDb();
  const collections = ['energy_readings', 'relay_events', 'settings', 'daily_summaries'];
  for (const colName of collections) {
    const q = query(collection(db, colName));
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);
    snapshot.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
    console.log(`[FIREBASE] Deleted ${snapshot.docs.length} docs from ${colName}`);
  }
}

export async function getDatabaseStats(): Promise<Record<string, number>> {
  const db = getDb();
  const collections = ['energy_readings', 'relay_events', 'settings', 'daily_summaries'];
  const stats: Record<string, number> = {};
  for (const colName of collections) {
    const snapshot = await getDocs(query(collection(db, colName)));
    stats[colName] = snapshot.docs.length;
  }
  return stats;
}