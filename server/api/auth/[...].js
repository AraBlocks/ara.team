//this file is ./server/api/auth/[...].js

import {Auth} from '@auth/core'//using the core inside Auth.js directly; https://authjs.dev/getting-started

import googleProvider  from '@auth/core/providers/google'
import twitterProvider from "@auth/core/providers/twitter"//𝕏, of course, but Auth.js still calls it twitter
import githubProvider  from '@auth/core/providers/github'

import discordProvider from '@auth/core/providers/discord'//more to do soon
import twitchProvider  from '@auth/core/providers/twitch'
import redditProvider  from '@auth/core/providers/reddit'

async function getAccess() {//ttd june, placeholder
	return {
		get(key) {
			return 'no value'
		}
	}
}

export default async (event) => {//refactored from export default Auth
	const access = await getAccess()//because we can't get secrets synchronously

	//google, uses Google’s OAuth 2.0 via OpenID Connect
	const googleConfiguration = googleProvider({
		clientId:     access.get('AUTH_GOOGLE_ID'),
		clientSecret: access.get('AUTH_GOOGLE_SECRET'),
		//default minimal scopes to prove account ownership and get basic profile information
	})
	const googleProfile = googleConfiguration.profile//get Auth.js's default profile mapping function,
	googleConfiguration.profile = async (raw) => {//to get the raw response from Google's OAuth API,
		let user = await googleProfile(raw)//call Auth.js's profile mapping function for google
		return {
			...user,//include all the properties Auth.js knew to pull from the google oauth response
			email_verified: raw.email_verified,//and also add this extra one we want so it will also be in the profile object below
		}
	}

	//twitter, uses X API v2 via OAuth 2.0 (PKCE)
	const twitterConfiguration = twitterProvider({
		clientId:      access.get('AUTH_TWITTER_ID'),
		clientSecret:  access.get('AUTH_TWITTER_SECRET'),
		authorization: {params: {scope: 'users.read'}},//only request the minimal "users.read" scope; default is "users.read tweet.read offline.access" which would need more approval, and tell the user our site could see their tweets; this is the only provider where we are changing from Auth.js's default authorization scopes
	})
	const twitterProfile = twitterConfiguration.profile
	twitterConfiguration.profile = async (raw) => {
		let user = await twitterProfile(raw)
		return {
			...user,
			username: raw.data.username,//twitter keeps the route-style name like "billgates" here; profile.name is "Bill Gates"
		}
	}

	//github, uses GitHub’s OAuth 2.0 Web Application Flow
	const githubConfiguration = githubProvider({
		clientId:     access.get('AUTH_GITHUB_ID'),
		clientSecret: access.get('AUTH_GITHUB_SECRET'),
	})
	const githubProfile = githubConfiguration.profile
	githubConfiguration.profile = async (raw) => { // custom mapping required to expose `login`
		const user = await githubProfile(raw);
		return {
			...user,
			login: raw.login//"billgates" github calls this your login, uses it in routes, profile.name can have spaces
		}
	}

	const authHandler = Auth({//set up the Auth.js handler, getting the function that knows how to handle oauth web requests
		providers: [
			googleConfiguration,
			twitterConfiguration,
			githubConfiguration,
		],
		callbacks: {
			async jwt({token, profile, account}) {
				if (token && profile && account) proofHasArrived(token, profile, account)
				return token//Auth.js expects our jwt() function to always return the token object it gives us
			},
		},

		/*
		Auth.js uses an essential cookie 🍪 to store and verify the OAuth handshake
		when twitter or whatever provider redirects back to /api/auth/callback,
		Auth.js writes a signed session token into this cookie so that it can confirm,
		here on the server, which user just authenticated

		if we were using Auth.js for all our user identity and browser session management,
		we'd keep this cookie around, and update it, but as we're only using Auth.js to let people prove
		they are billgates at twitter, or whatever, we don't need it after the oauth flow is done

		but we set its expiration to 4 minutes, rather than zero, just in case zero might mess something up
		with some provider now, or cause an error later, if a provider changes something on their end
		those kinds of errors can be really hard to identify and diagnose

		by default, Auth.js sets these secure attributes on its cookie
		HttpOnly:  true       prevents JavaScript (including page scripts & extensions) from accessing it
		SameSite:  "lax"      only sent on top‐level navigations (e.g. the OAuth callback redirect), but not on cross-site subrequests
		Secure:    true       only transmitted over HTTPS connections, not HTTP
		Path:      "/"        sent on every request to our domain
		Domain:    (omitted)  defaults to the exact host serving it; third‐party domains cannot read or send it
		*/
		session: {
			maxAge: 240,//4 minutes in seconds, how long Auth.js’s cookie will last
			updateAge: 0,// tell Auth.js to never refresh this cookie; it will expire naturally shortly
		},
		secret: access.get('AUTH_SECRET'),//Auth.js needs a random secret we define to sign things; it should be 32 bytes of random so like 64 base16 characters; and we don't have to rotate it
	})
	return authHandler(event)//call the Auth.js handler we set up, giving it the event and returning its result
}

//when code reaches here, the person at the browser connected to our server is signed into google, has told google they want to use their google account with our site, and auth.js running on our server has confirmed all of this is correct with google
function proofHasArrived(token, profile, account) {

	account.provider//will be like "google" or "twitter"

	//these four auth core normalizes and includes, although some can still be null some times
	profile.id//should be the id set by the provider for this user that doesn't change, even if the user changes their info there
	profile.name//user name
	profile.email//email, if the user has one with this provider
	profile.image//url to avatar image, but we're not going to use this

	//beyond that are the extra and custom ones we pulled out of the raw responses above
	profile.email_verified//true if google, and user has email there, and user verified that email with google
	profile.username//twitter's simpler route-style name, "billgates" rather than profile.name "Bill Gates"

	/*
	At this point:
	1) Look up or create your own User in the database.
	2) Issue your own long-lived session cookie or JWT for your application.
	3) Redirect the browser back into your app’s UI.
	Auth.js’s cookie will expire on its own in 4 minutes, and you never call /api/auth/session,
	so Auth.js won’t attempt any further validations.
	*/
}
