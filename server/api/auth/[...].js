//this file is ./server/api/auth/[...].js
//the ellipsis is Nuxt's way of registering this to handle both /api/auth/something and /api/auth/something/deeper routes

import {Auth} from '@auth/core'//using the core inside Auth.js directly; https://authjs.dev/getting-started

import googleProvider  from '@auth/core/providers/google'
import twitterProvider from "@auth/core/providers/twitter"//𝕏, of course, but Auth.js still calls it twitter
import githubProvider  from '@auth/core/providers/github'

import discordProvider from '@auth/core/providers/discord'//more to do soon
import twitchProvider  from '@auth/core/providers/twitch'
import redditProvider  from '@auth/core/providers/reddit'

/*
what module should we use for oauth?
we want one high level enough that it has pluggable submodules specific to popular providers
and will iron out all the wrinkles between Twitter and Discord,
whether they use oauth v1 or 2, and PKCS, and so on

 _   _            _             _ _   _                   
| |_| |__   ___  | |_ _ __ __ _(_) | | |__   ___ _ __ ___ 
| __| '_ \ / _ \ | __| '__/ _` | | | | '_ \ / _ \ '__/ _ \
| |_| | | |  __/ | |_| | | (_| | | | | | | |  __/ | |  __/
 \__|_| |_|\___|  \__|_|  \__,_|_|_| |_| |_|\___|_|  \___|
                                                          
a long trail led to @auth/core...
(1) there are turnkey identity providers like auth0.com
but a service provider can become slow, unreliable, expensive,
or require immediate developer attention to stay aligned with an update,
or they can go out of business,
or just deplatform you, without warning, cause, reinstatement, or recourse

ok, so how about npm modules
(2) Passport.js is the leader, with 3.5 million weekly downloads,
and with over 500 provider-specific strategies
but, it's Express middleware, intended for a regular server and Node
and we don't have Express, Node, or even a server!

(3) Auth.js, formerly NextAuth, has 1.4 million weekly downloads 
https://www.npmjs.com/package/next-auth
but is specific to Next.js, which is React; we are Nuxt and Vue

but Auth's rebrand is about branching out to support all popular frameworks:
https://authjs.dev/getting-started/integrations
(4) and there's one for Nuxt, but it's status is "Open PR",
linking to a github thread with lots of waiting and disappointment:
https://github.com/nextauthjs/next-auth/pull/10684

(5) so our strategy is to use @auth/core, the core of Auth.js
which is lower level than being React or Next or Nuxt-specific
but still at a level where we get modules that know about specific providers

another thing that made the search difficult is most of these solutions
want to be your whole user identity and user management system
but then they'd make a bunch of cookies that require a warning, or expire users after 30 days
and come in with their own logic and practices for how a user changes how they sign in
and through all that they, not us, own all the users. great for them and bad for us!

we're looking for a way a person at a browser can prove to our server, just once, right now
that they control a third party social media account
and get some information about their identity there, like their id, name, and email

also, none of this search was about web3 or crypto wallets!
that's a whole second world of solutions of all these types that's still on the backlog

in researching this now, also found this similar rant:
https://www.better-auth.com/docs/comparison
*/

export default async (event) => {//refactored from export default Auth
	const access = await getAccess()//because we can't get secrets synchronously

	//google, uses Google’s OAuth 2.0 via OpenID Connect
	const googleConfiguration = googleProvider({
		clientId:     access.get('ACCESS_OAUTH_GOOGLE_ID'),
		clientSecret: access.get('ACCESS_OAUTH_GOOGLE_SECRET'),
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
		clientId:      access.get('ACCESS_OAUTH_TWITTER_ID'),
		clientSecret:  access.get('ACCESS_OAUTH_TWITTER_SECRET'),
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
		clientId:     access.get('ACCESS_OAUTH_GITHUB_ID'),
		clientSecret: access.get('ACCESS_OAUTH_GITHUB_SECRET'),
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

			//Auth.js calls this once after the person as the browser is back from the provider, and our server has proof they control a social media account
			async jwt({token, profile, account}) {//token is the current JWT object, empty on first sign-in; profile is the normalized user profile Auth.js mapped from the raw JSON response from the provider, with our additions above
				if (profile && account) proofHasArrived(token, profile, account)//check profile and account so our code runs only at the end of successful oauth flow, not on a session check or malicious hit to /api/auth/session
				return token//Auth.js expects our jwt() function to always return the token object it gives us
			},
			//ttd june, more common unhappy path is user says no to twitter, just closes the tab; be able to see those unfinished flows in the database as they will go 100% if the provider breaks or turns us off, too!

			//Auth.js calls this right afterwards asking us where we should send the user who is finished
			async redirect({
				url,//Auth.js gives us our callbackUrl from the starting link like "/api/auth/signin/twitter?callbackUrl=/whatever"
				baseUrl,//and the domain of our own site, like "https://oursite.com"
			}) {//return like "/done" and Auth.js will use this in the finishing 302 redirect that exits the user finishing the flow
				return '/app'
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
			maxAge: 900,//15 minutes in seconds, how long Auth.js’s cookie will last
			updateAge: 0,// tell Auth.js to never refresh this cookie; it will expire naturally shortly
		},
		secret: access.get('ACCESS_AUTHJS_SIGNING_KEY_SECRET'),//Auth.js needs a random secret we define to sign things; we don't have to rotate it; generate with $ openssl rand -hex 32
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

async function getAccess() {//ttd june, this placeholder function is async for when we must also decrypt secrets
	const runtimeConfiguration = useRuntimeConfig()//this is how we have to get secrets through Nuxt
	return {
		get(key) {
			return runtimeConfiguration[key] ?? ''//get any existing key by name, or blank if missing
		}
	}
}

/*
 _                      ___    _         _   _                          _        
| |__   _____      __  / _ \  / \  _   _| |_| |__   __      _____  _ __| | _____ 
| '_ \ / _ \ \ /\ / / | | | |/ _ \| | | | __| '_ \  \ \ /\ / / _ \| '__| |/ / __|
| | | | (_) \ V  V /  | |_| / ___ \ |_| | |_| | | |  \ V  V / (_) | |  |   <\__ \
|_| |_|\___/ \_/\_/    \___/_/   \_\__,_|\__|_| |_|   \_/\_/ \___/|_|  |_|\_\___/
                                                                                 

(1) user starts out on our page to sign up or sign in
user clicks "Continue with Twitter"
which is a regular link to a route Auth handles

	GET https://oursite.com/api/auth/signin/twitter

(2) Auth returns a response from our server to the browser, setting two cookies
Auth makes a new random CSRF_TOKEN and hashes it with ACCESS_AUTHJS_SIGNING_KEY_SECRET
STATE_NONCE is another random string for this user's trip through the flow,
which Auth both saves in a cookie and sends to Twitter
the response also redirects the browser to Twitter's page

	HTTP/1.1 302 Found
	Set-Cookie: __Host-next-auth.csrf-token=CSRF_TOKEN|HASH_OF_CSRF_TOKEN; Path=/api/auth; HttpOnly; Secure; SameSite=Lax
	Set-Cookie: __Host-next-auth.state=STATE_NONCE; Path=/api/auth; HttpOnly; Secure; SameSite=Lax; Max-Age=900
	Location: https://twitter.com/i/oauth2/authorize?
		client_id=<OUR_CLIENT_ID>& -- stored in server secrets; we got from Twitter's developer dashboards
		redirect_uri=https%3A%2F%2Foursite.com%2Fapi%2Fauth%2Fcallback%2Ftwitter& -- set here and in dashboards
		response_type=code& -- we want an authorization code
		scope=users.read& -- ask your user to give us permission to read their user information
		state=<STATE_NONCE> -- a random nonce to identify this request, and prevent replay

Twitter's page shows the user consent details
the user signs in if they are not signed in already
the user clicks to approve the oauth connection and permissions our site is asking for
POSTs from the Twitter page to Twitter's backend happen as the user does all this, not described here

(3) once Twitter has identified the person as one of their users, and gained consent,
Twitter responds to the browser with a redirect sending them back to our site

	HTTP/1.1 302 Found
	Location: https://oursite.com/api/auth/callback/twitter?
		code=<AUTH_CODE>& -- a short lived code we'll use in a moment
		state=<STATE_NONCE> -- back from Twitter, must match the cookie

navigating to that location, the browser includes the cookies

	GET /api/auth/callback/twitter?code=<AUTH_CODE>&state=STATE_NONCE -- here the page could tamper with this value
	Host: oursite.com
	Cookie:
		__Host-next-auth.csrf-token=CSRF_TOKEN|HASH_OF_CSRF_TOKEN
		__Host-next-auth.state=STATE_NONCE -- here the page can't tamper with this value; only our server could set it

this calls into an Auth route, so Auth runs on our server behind the scenes
Auth uses ACCESS_AUTHJS_SIGNING_KEY_SECRET to compute a matching HASH_OF_CSRF_TOKEN
the STATE_NONCE in the query string and cookie must match,
proving the browser contacting our server now is the same one that started the flow

(4) Auth POSTs to Twitter's backend
note that AUTH_CODE came from Twitter, but was told to our server by our page, which could have tampered with it
so, Auth sends it to Twitter, server to server, to verify it's authentic

	POST https://api.twitter.com/2/oauth2/token
	Content-Type: application/x-www-form-urlencoded
	- - - -
	grant_type=authorization_code&
	client_id=<OUR_CLIENT_ID>&
	client_secret=<OUR_CLIENT_SECRET>& -- as this is server to server, includes our password to Twitter's API
	code=<AUTH_CODE>&
	redirect_uri=https%3A%2F%2Foursite.com%2Fapi%2Fauth%2Fcallback%2Ftwitter

	{
		"token_type": "bearer",
		"access_token": "<ACCESS_TOKEN>", -- Twitter gives Auth a token to use next
		"expires_in": 7200, -- which only lasts 2 hours
		"scope": "users.read"
	}

that POST also uses AUTH_CODE to get ACCESS_TOKEN
a second GET uses ACCESS_TOKEN to get information about the Twitter user

	GET https://api.twitter.com/2/users/me
	Authorization: Bearer <ACCESS_TOKEN>

	{
		"data": {
			"id": "123456789",
			"name": "Bill Gates",
			"username": "billgates"
		}
	}

After doing all that behind the scenes, Auth calls the jwt() function we wrote,
letting our code associate this browser with our user who we know controls that Twitter account

(5) Auth then calls our redirect() function, which tells Auth where to go when we're all done

	HTTP/1.1 302 Found
	Set-Cookie: __Secure-next-auth.session-token=<JWT_PAYLOAD…>; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=900
	Location: /done

There's more that can happen, like PKCE, but this describes a real, albeit simple, flow
*/
