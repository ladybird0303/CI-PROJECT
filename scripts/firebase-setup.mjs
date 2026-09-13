// =============================================================================
// Firebase Setup Script
// Run with: node scripts/firebase-setup.mjs
// 
// This script will:
// 1. Delete ALL existing data in Firestore
// 2. Seed the database with initial structure
// =============================================================================

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// --- Service Account Key ---
// Download from: Firebase Console → Project Settings → Service accounts → Generate new private key
const SERVICE_ACCOUNT_PATH = join(__dirname, '..', 'service-account-key.json');

if (!existsSync(SERVICE_ACCOUNT_PATH)) {
  console.error('\n❌ Service account key not found!');
  console.log('   Download it from:');
  console.log('   Firebase Console → Project Settings → Service accounts → Generate new private key');
  console.log(`   Save as: ${SERVICE_ACCOUNT_PATH}\n`);
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'));

// Initialize Firebase Admin
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

// --- Delete All Data ---
async function deleteAllData() {
  console.log('\n🗑️  Deleting all existing data...\n');
  
  const collections = ['energy_readings', 'relay_events', 'settings', 'daily_summaries'];
  
  for (const colName of collections) {
    const snapshot = await db.collection(colName).get();
    
    if (snapshot.empty) {
      console.log(`   📂 ${colName}: empty (nothing to delete)`);
      continue;
    }

    const batch = db.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    
    console.log(`   🗑️  ${colName}: deleted ${snapshot.size} documents`);
  }
  
  console.log('\n✅ All data deleted successfully!\n');
}

// --- Seed Database ---
async function seedDatabase() {
  console.log('🌱 Seeding database with initial structure...\n');
  
  // Seed user settings
  const settingsRef = db.collection('settings').doc('user_config');
  await settingsRef.set({
    unitPriceBDT: 8.50,
    monthlyBudgetBDT: 2500,
    monthlyBudgetKWh: 300,
    powerThreshold: 10.0,
    relayNames: ['Load 1', 'Load 2', 'Load 3'],
    autoRelayCutoffOnTheft: true,
    updatedAt: Timestamp.now(),
  });
  console.log('   📝 settings/user_config: created');
  
  // Seed a sample energy reading
  await db.collection('energy_readings').add({
    voltage: 0,
    current: 0,
    power: 0,
    relayStates: [false, false, false],
    timestamp: Timestamp.now(),
  });
  console.log('   📊 energy_readings: sample document created');
  
  // Seed a sample relay event
  await db.collection('relay_events').add({
    channel: 1,
    state: false,
    source: 'app',
    relayName: 'Load 1',
    timestamp: Timestamp.now(),
  });
  console.log('   🔌 relay_events: sample document created');
  
  // Seed a sample daily summary
  const today = new Date().toISOString().split('T')[0];
  await db.collection('daily_summaries').doc(today).set({
    date: today,
    totalEnergyWh: 0,
    peakPower: 0,
    avgVoltage: 0,
    relayOnTimeMinutes: 0,
    readingCount: 0,
  });
  console.log('   📅 daily_summaries: sample document created');
  
  console.log('\n✅ Database seeded successfully!\n');
}

// --- Verify ---
async function verifyDatabase() {
  console.log('🔍 Verifying database structure...\n');
  
  const collections = ['energy_readings', 'relay_events', 'settings', 'daily_summaries'];
  
  for (const colName of collections) {
    const snapshot = await db.collection(colName).get();
    console.log(`   📂 ${colName}: ${snapshot.size} documents`);
  }
  
  console.log('\n✅ Verification complete!\n');
}

// --- Main ---
async function main() {
  try {
    await deleteAllData();
    await seedDatabase();
    await verifyDatabase();
    console.log('🎉 Firebase setup complete!');
    console.log('\nNext steps:');
    console.log('   1. Run: firebase deploy --only firestore:rules');
    console.log('   2. Run: firebase deploy --only firestore:indexes');
    console.log('   3. Fill in Firebase config in services/firebase.ts');
    console.log('   4. Run: npx expo start\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
