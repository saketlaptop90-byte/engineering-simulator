import { jwtVerify, createRemoteJWKSet } from 'jose';

const FIREBASE_JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';

let cachedSettings = null;
let lastSettingsFetch = 0;

async function getSettings(env) {
    if (cachedSettings && Date.now() - lastSettingsFetch < 60000) {
        return cachedSettings;
    }
    const projectId = env.FIREBASE_PROJECT_ID || 'engineering-universe';
    try {
        const fbRes = await fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/settings/credits`);
        if (fbRes.ok) {
            const data = await fbRes.json();
            if (data.fields) {
                cachedSettings = {
                    freeDaily: parseInt(data.fields.freeDaily?.integerValue || 5),
                    proDaily: parseInt(data.fields.proDaily?.integerValue || 20)
                };
            }
        }
    } catch (e) {
        console.error("Failed to fetch settings from Firebase", e);
    }
    
    if (!cachedSettings) {
        cachedSettings = { freeDaily: 5, proDaily: 20 };
    }
    lastSettingsFetch = Date.now();
    return cachedSettings;
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-Tier',
        },
      });
    }

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    };

    const url = new URL(request.url);

    if (request.method !== 'POST' && request.method !== 'GET') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders });
    }

    try {
      const authHeader = request.headers.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ error: 'Missing or invalid Authorization header' }), { status: 401, headers: corsHeaders });
      }

      const token = authHeader.split(' ')[1];
      const projectId = env.FIREBASE_PROJECT_ID || 'engineering-universe';
      
      let payload;
      try {
        const JWKS = createRemoteJWKSet(new URL(FIREBASE_JWKS_URL));
        const { payload: jwtPayload } = await jwtVerify(token, JWKS, {
          issuer: `https://securetoken.google.com/${projectId}`,
          audience: projectId,
        });
        payload = jwtPayload;
      } catch (err) {
        console.error('JWT Verification Error:', err);
        return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers: corsHeaders });
      }

      const email = payload.email || payload.sub;

      const userTier = request.headers.get('X-User-Tier') === 'pro' ? 'pro' : 'free';
      const settings = await getSettings(env);
      const DAILY_CREDITS = userTier === 'pro' ? settings.proDaily : settings.freeDaily;
      
      if (userTier === 'free') {
        await new Promise(r => setTimeout(r, 1000));
      }

      const body = await request.json();
      const messages = body.messages || [];

      const now = Date.now();
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      const oneDay = 24 * 60 * 60 * 1000;
      const oneYear = 365 * 24 * 60 * 60 * 1000;
      
      let user;
      try {
        user = await env.DB.prepare('SELECT * FROM users_v2 WHERE email = ?').bind(email).first();
      } catch (dbErr) {
        console.log('Database missing users_v2, auto-creating...');
        await env.DB.exec(`
          CREATE TABLE IF NOT EXISTS users_v2 (
              email TEXT PRIMARY KEY,
              ai_balance INTEGER DEFAULT 0,
              last_daily_reset INTEGER,
              last_yearly_reset INTEGER
          );
        `);
        user = await env.DB.prepare('SELECT * FROM users_v2 WHERE email = ?').bind(email).first();
      }
      
      if (!user) {
        await env.DB.prepare('INSERT INTO users_v2 (email, ai_balance, last_daily_reset, last_yearly_reset) VALUES (?, ?, ?, ?)')
          .bind(email, DAILY_CREDITS, now, now)
          .run();
        user = { ai_balance: DAILY_CREDITS };
      } else {
        let newBalance = user.ai_balance;
        let lastDaily = user.last_daily_reset;
        let lastYearly = user.last_yearly_reset;
        let updated = false;

        if (userTier === 'free') {
          // Normal users accumulate for a week, then reset to baseline
          if (now - lastYearly > oneWeek) {
            newBalance = DAILY_CREDITS;
            lastYearly = now;
            lastDaily = now;
            updated = true;
          } else if (now - lastDaily > oneDay) {
            newBalance += DAILY_CREDITS;
            lastDaily = now;
            updated = true;
          }
        } else {
          // Pro users accumulate for a year
          if (now - lastYearly > oneYear) {
            newBalance = DAILY_CREDITS;
            lastYearly = now;
            lastDaily = now;
            updated = true;
          } else if (now - lastDaily > oneDay) {
            newBalance += DAILY_CREDITS;
            lastDaily = now;
            updated = true;
          }
        }

        if (updated) {
          await env.DB.prepare('UPDATE users_v2 SET ai_balance = ?, last_daily_reset = ?, last_yearly_reset = ? WHERE email = ?')
            .bind(newBalance, lastDaily, lastYearly, email)
            .run();
        }

        if (url.pathname === '/credits' && request.method === 'GET') {
          return new Response(JSON.stringify({ credits: newBalance }), { status: 200, headers: corsHeaders });
        }

        if (newBalance <= 0) {
          return new Response(JSON.stringify({ 
            error: `You have exhausted your AI credits. Please upgrade or wait for your next deposit.` 
          }), { status: 429, headers: corsHeaders });
        }
        
        await env.DB.prepare('UPDATE users_v2 SET ai_balance = ai_balance - 1 WHERE email = ?')
          .bind(email)
          .run();
          
        user.ai_balance = newBalance - 1;
      }

      console.log('Calling AI model for:', email);
      const aiResponse = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
        messages: messages,
        stream: true
      });

      return new Response(aiResponse, { 
        headers: {
            ...corsHeaders,
            'Content-Type': 'text/event-stream',
            'X-User-Tier': userTier,
            'X-Requests-Left': user.ai_balance.toString()
        }
      });

    } catch (error) {
      console.error('Unhandled Server Error:', error);
      return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), { status: 500, headers: corsHeaders });
    }
  },
};
