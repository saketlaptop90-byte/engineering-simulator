const admin = require('firebase-admin');
const https = require('https');

const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbyfgDmCDYKghrhe9IVpT6_LKHenbrB2JxHVQ8NgdfCqsWBK0VCPqvYv6BfIBgrKMo1jRg/exec';

// Initialize Firebase Admin
let serviceAccount;
try {
  serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString('utf8'));
} catch (e) {
  console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT base64 string", e);
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

function sendWebhook(to, name) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      to: to,
      subject: `Happy Birthday, ${name}! 🎉 - From EngiSim`,
      htmlBody: `
        <div style="font-family: 'Courier New', Courier, monospace; background-color: #02040a; color: #fff; padding: 40px; text-align: center; border: 1px solid #00f2fe; border-radius: 10px;">
          <h1 style="color: #00f2fe;">Happy Birthday! 🎂</h1>
          <p style="font-size: 16px; color: #ccc;">Dear ${name},</p>
          <p style="font-size: 16px; color: #ccc;">Wishing you a fantastic birthday from all of us at EngiSim Pro. We hope you have a great day filled with joy, engineering wonders, and lots of cake!</p>
          <br>
          <p style="font-size: 16px; color: #ccc;">Keep exploring,</p>
          <p style="font-size: 16px; color: #00f2fe; font-weight: bold;">The EngiSim Team</p>
          <br>
          <a href="https://engineering-universe.web.app" style="display: inline-block; padding: 10px 20px; background-color: #00f2fe; color: #000; text-decoration: none; font-weight: bold; border-radius: 5px;">Visit EngiSim Pro</a>
        </div>
      `,
      secret: "ENGISIM_SECRET_2026"
    });

    const url = new URL(WEBHOOK_URL);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body);
        } else {
          reject(new Error(`Webhook failed with status ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function run() {
  try {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayString = `-${month}-${day}`;

    console.log(`Checking for birthdays ending in ${todayString}`);

    const usersSnap = await db.collection('users').get();
    let emailsSent = 0;
    
    for (const doc of usersSnap.docs) {
      const u = doc.data();
      if (u.dateOfBirth && u.dateOfBirth.endsWith(todayString) && u.email) {
        const name = u.displayName || 'EngiSim Pro User';
        console.log(`Sending birthday email to ${u.email}...`);
        
        try {
          await sendWebhook(u.email, name);
          emailsSent++;
          console.log(`Sent to ${u.email}`);
        } catch (err) {
          console.error(`Failed to send to ${u.email}`, err);
        }
      }
    }

    if (emailsSent > 0) {
      console.log(`Updating admin_stats/emails with ${emailsSent} sent emails.`);
      const statsRef = db.collection('admin_stats').doc('emails');
      const statsDoc = await statsRef.get();
      if (statsDoc.exists) {
        await statsRef.update({
          birthdayEmailsSent: admin.firestore.FieldValue.increment(emailsSent)
        });
      } else {
        await statsRef.set({
          birthdayEmailsSent: emailsSent
        }, { merge: true });
      }
    }

    console.log("Done.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
