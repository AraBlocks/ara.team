// File: [...].js - The [...] pattern in the filename makes this a catch-all route handler
// 
// The routing happens in two steps:
// 1. Nuxt routes any /api/auth/* request to this handler (because of [...] in filename)
// 2. This handler passes the request to Auth.js, which then handles these routes:
//    - /api/auth/signin/discord    -> Start Discord OAuth flow
//    - /api/auth/signin/twitter    -> Start X (Twitter) OAuth flow
//    - /api/auth/callback/discord  -> Handle Discord callback
//    - /api/auth/callback/twitter  -> Handle X (Twitter) callback
//
// Note: Despite Twitter's rebrand to X, Auth.js still uses "twitter" in URLs
// and configuration for compatibility. It uses OAuth 2.0 by default.

import { Auth } from '@auth/core';
import Discord from '@auth/core/providers/discord';
import Twitter from '@auth/core/providers/twitter';  // Uses X (Twitter) OAuth 2.0 by default

// Step 1: Nuxt calls this handler for any /api/auth/* request
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();//here's how secrets come in from .env and nuxt.config.ts

  // Parse the provider name and flow stage from URLs like:
  // /api/auth/signin/discord  -> Starting OAuth flow
  // /api/auth/callback/discord -> Provider redirected back to us
  const url = event.node.req.url;
  const match = url?.match(/\/api\/auth\/(signin|callback)\/(\w+)/);
  const [_, stage, provider] = match ?? [];
  if (provider && stage) {
    if (stage === 'signin') {
      console.log(`Starting ${provider} OAuth flow...`);
    } else if (stage === 'callback') {
      console.log(`Handling ${provider} OAuth callback...`);
    }
  }
  
  // Log which auth endpoint is being accessed
  console.log('Auth request path:', event.node.req.url);
  
  // Step 2: Configure Auth.js - this is Auth.js's configuration format, not Nuxt's
  // Auth.js uses this config to:
  // - Set up OAuth providers (Discord, Twitter)
  // - Handle OAuth callbacks
  // - Manage what permissions we request
  // - Control session behavior
  const authConfig = {
    providers: [
      Discord({
        clientId: config.discordClientId,
        clientSecret: config.discordClientSecret,
        authorization: {
          params: {
            // Discord's 'identify' scope is the minimum needed
            // It only gives us:
            // - User's Discord ID (for verification)
            // - Basic username
            // Does NOT request email, guilds, or other permissions
            scope: 'identify'
          }
        }
      }),
      Twitter({
        clientId: config.twitterClientId,
        clientSecret: config.twitterClientSecret
        // Twitter's OAuth 2.0 defaults to minimal scope
        // We automatically get:
        // - User's Twitter ID (for verification)
        // - Basic profile info
        // No explicit scope needed
      })
    ],
    secret: config.authSecret,//the secret we generated, used for signing tokens for all providers
    
    // Trust the Host header when building callback URLs
    // This is safe because we're behind Cloudflare's proxy:
    // 1. Cloudflare sets the correct Host header
    // 2. SSL/TLS is terminated at Cloudflare
    // 3. Callback URLs will match what's registered with OAuth providers
    trustHost: true,

    // Session configuration controls how Auth.js handles authentication state
    // NOTE: This is an unusual Auth.js configuration!
    // Most Auth.js users create login systems with persistent sessions.
    // We're different because:
    // 1. We only verify identity (no login/session needed)
    // 2. We run on edge functions (must use JWT strategy)
    session: {
      // FOR DEVELOPMENT ONLY:
      // maxAge: 5 * 60, // 5 minutes in seconds - lets us inspect the cookie
      // To find the cookie in Chrome DevTools:
      // 1. Application tab > Storage > Cookies > https://ara.team
      // 2. Look for 'authjs.session-token'
      // 3. Cookie will be HttpOnly (not readable by JS)
      // 4. Cookie domain will be .ara.team
      // 5. Cookie path will be /
      //
      // FOR PRODUCTION:
      maxAge: 0, // No persistent session after OAuth completes
      
      // During the OAuth flow itself, Auth.js still maintains state
      // in a temporary cookie+JWT until the flow completes.
      // After verification succeeds, this temporary state is cleaned up

      // strategy: 'jwt' tells Auth.js to:
      // 1. Create a temporary JWT during OAuth flow
      // 2. Store it in a secure HTTP-only cookie
      // 3. Use this cookie+JWT to maintain state during Discord/Twitter redirects
      // 4. Delete the cookie immediately after verification (due to maxAge: 0)
      //
      // Using 'jwt' is required for Cloudflare Workers because:
      // - Edge functions are stateless
      // - Database sessions aren't possible
      // - JWTs in cookies work well at the edge
      strategy: 'jwt'
    },
    callbacks: {
      async signIn({ user, account, profile }) {
        // Log the verified identity data
        console.log('Verified user:', { 
          provider: account?.provider,
          id: account?.providerAccountId,
          name: user?.name
        });
        
        // Return false to prevent session creation
        return false;
      }
    }
  };

  // Pass the full request (including URL) to Auth.js
  return Auth(event.node.req, event.node.res, authConfig);
}); 