const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// NOTE: You must generate a private key file for your service account from the Firebase Console.
// Go to Project Settings > Service Accounts > Generate New Private Key
// Save the file as "serviceAccountKey.json" in the same directory as this script.
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error("ERROR: serviceAccountKey.json not found!");
  console.error("Please download it from Firebase Console (Project Settings > Service Accounts) and place it in the 'scripts' folder.");
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const collectionsToBackup = [
  'users',
  'community_posts',
  'model_requests',
  'activity_log',
  'chats'
];

async function exportCollection(collectionName, backupDir) {
  console.log(`Starting backup of collection: ${collectionName}...`);
  const snapshot = await db.collection(collectionName).get();
  
  const data = [];
  snapshot.forEach(doc => {
    data.push({
      id: doc.id,
      ...doc.data()
    });
  });

  const filePath = path.join(backupDir, `${collectionName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Saved ${data.length} documents to ${filePath}`);
}

async function runBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(__dirname, '..', 'backups', timestamp);

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  console.log(`Backing up data to: ${backupDir}`);

  for (const collection of collectionsToBackup) {
    try {
      await exportCollection(collection, backupDir);
    } catch (err) {
      console.error(`Error backing up collection ${collection}:`, err);
    }
  }

  console.log("\nBackup complete! You can now manually upload the 'backups' folder to your Google Drive.");
}

runBackup().catch(console.error);
