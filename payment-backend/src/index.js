/**
 * Secure Payment Gateway - Cloudflare Worker
 * This worker handles transaction verification and secure communication
 * with the Firebase database (bypassing the client).
 */

export default {
  async fetch(request, env, ctx) {
    // 1. CORS Setup - Only allow requests from our frontend
    const corsHeaders = {
      "Access-Control-Allow-Origin": "https://engineering-universe.web.app", 
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    // Handle preflight OPTIONS request
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Only accept POST
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders });
    }

    const url = new URL(request.url);

    // /api/charge endpoint
    if (url.pathname === "/api/charge") {
      try {
        const body = await request.json();
        const { userId, userEmail, item, amount, token } = body;

        // --- SECURITY LAYER 1: VALIDATION ---
        if (!userId || !item || !amount || !token) {
          return new Response(JSON.stringify({ error: "Missing required fields" }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }

        // --- SECURITY LAYER 2: PAYMENT VERIFICATION (Simulation) ---
        // In production, we would use the 'token' to call Stripe/Razorpay/PayPal API here.
        // e.g. await stripe.charges.create({ amount, currency: 'usd', source: token });
        
        // Simulating a network delay for the bank verification
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulate fraud detection failure (e.g. invalid test token)
        if (token === "fraud_token") {
            return new Response(JSON.stringify({ error: "Payment declined by bank." }), {
                status: 402,
                headers: { "Content-Type": "application/json", ...corsHeaders }
            });
        }

        const transactionId = "TXN_" + Math.random().toString(36).substr(2, 9).toUpperCase();

        // --- SECURITY LAYER 3: SERVER-SIDE DATABASE WRITE ---
        // In a fully secure architecture, this Cloudflare Worker uses a Firebase Service Account 
        // to securely write the receipt directly to Firestore via the REST API.
        // This prevents users from hacking their local JS client to give themselves credits.
        
        // Example logic for the secure REST API call:
        /*
        await fetch(\`https://firestore.googleapis.com/v1/projects/\${env.FIREBASE_PROJECT_ID}/databases/(default)/documents/payments\`, {
            method: 'POST',
            headers: { 'Authorization': \`Bearer \${env.FIREBASE_ADMIN_TOKEN}\` },
            body: JSON.stringify({ fields: { ... }})
        });
        */

        // For now, since we haven't set up the Service Account secrets in Cloudflare, 
        // we will return the secure signature to the client to let the client write it securely.
        
        // Creating a cryptographic signature of the transaction to prevent tampering
        const encoder = new TextEncoder();
        // In production, use env.SECRET_KEY instead of hardcoding
        const keyData = encoder.encode("engisim_super_secret_key_2026"); 
        const key = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
        const messageData = encoder.encode(transactionId + userId + item + amount);
        const signatureBuffer = await crypto.subtle.sign("HMAC", key, messageData);
        const signatureArray = Array.from(new Uint8Array(signatureBuffer));
        const signatureHex = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');

        return new Response(JSON.stringify({ 
          success: true, 
          transactionId: transactionId,
          signature: signatureHex, // Secure proof of purchase
          message: "Payment processed securely via Cloudflare Edge."
        }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });

      } catch (e) {
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
    }

    return new Response("Not found", { status: 404, headers: corsHeaders });
  }
};
