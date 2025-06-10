//this implementation is [@auth/core] in [Nuxt] deploying to [ara.team] ~ abandoning nonfunctioning

//this file is ./server/api/auth/[...].js
//the ellipsis is Nuxt's way of registering this to handle both /api/auth/something and /api/auth/something/deeper routes

import {fromNodeMiddleware} from 'h3'

import {Auth} from '@auth/core'//using the core inside Auth.js directly; https://authjs.dev/getting-started

import googleProvider  from '@auth/core/providers/google'
import twitterProvider from "@auth/core/providers/twitter"//𝕏, of course, but Auth.js still calls it twitter
import githubProvider  from '@auth/core/providers/github'
import discordProvider from '@auth/core/providers/discord'
import twitchProvider  from '@auth/core/providers/twitch'
import redditProvider  from '@auth/core/providers/reddit'

function includeResponse(configuration) {//takes a provider-specific Auth.js configuration object
	let profileFunction = configuration.profile//saves the reference to Auth's response parsing function
	configuration.profile = async (...a) => {//to replace it with this one
		let pulled = await profileFunction(...a)//which starts out by calling it to get .id .name .email and .image
		return {...pulled, response: a[0]}//and alongside those, also includes the response body from the provider, which is the first argument
	}
	return configuration
}

export default fromNodeMiddleware((req, res) => {
	const access = getAccess()
	const settings = {

		//google, https://console.cloud.google.com/apis/credentials
		//also must verify site ownership, https://search.google.com/search-console/ownership
		//and google deletes if no activity for 6 months, https://support.google.com/cloud/answer/15549257#unused-client-deletion
		google: {//uses Google’s OAuth 2.0 via OpenID Connect
			clientId: access.get('ACCESS_OAUTH_GOOGLE_ID'), clientSecret: access.get('ACCESS_OAUTH_GOOGLE_SECRET'),
		},

		//X, https://developer.x.com/en/portal/projects-and-apps
		twitter: {//uses X API v2 via OAuth 2.0 (PKCE)
			clientId: access.get('ACCESS_OAUTH_TWITTER_ID'), clientSecret: access.get('ACCESS_OAUTH_TWITTER_SECRET'),
			authorization: {params: {scope: 'users.read'}},//only request the minimal "users.read" scope; default is "users.read tweet.read offline.access" which would need more approval, and tell the user our site could see their tweets
		},

		//github, github.com, Your Organizations, Settings, left bottom Developer settings, OAuth Apps
		github: {//uses GitHub’s OAuth 2.0 Web Application Flow
			clientId: access.get('ACCESS_OAUTH_GITHUB_ID'), clientSecret: access.get('ACCESS_OAUTH_GITHUB_SECRET'),
		},

		//discord, https://discord.com/developers/applications
		discord: {//uses Discord’s OAuth2
			clientId: access.get('ACCESS_OAUTH_DISCORD_ID'), clientSecret: access.get('ACCESS_OAUTH_DISCORD_SECRET'),
		},
	}

	const config = {

		providers: [
			includeResponse(googleProvider(settings.google)),
			includeResponse(twitterProvider(settings.twitter)),
			includeResponse(githubProvider(settings.github)),
			includeResponse(discordProvider(settings.discord)),//for each of these, we call Auth's function to turn the settings for this provider we prepared into a configuration object, and then use our helper function to augment the profile function with one that also includes the raw response body from the provider
		],

		callbacks: {
			signIn: async ({account, profile}) => {//Auth calls our signIn() method once when the user and Auth have finished successfully with the third-party provider
				let destination = '/oauth-done'
				try {
					proofHasArrived(account, profile)
					let message = {
						provider: account.provider,
						id: profile.id,
						name: profile.name,
						handle: profile.handle,
						email: profile.email,
						emailVerified: profile.emailVerified,
						response: profile.response,//also let's see the whole thing; ttd june, just for the local sanity check
					}
					destination += '?message=' + encodeURIComponent(JSON.stringify(message))
				} catch (e) { console.error(e) }
				return destination
			},
		},

		session: {
			maxAge: 900,//15 minutes in seconds; intending us to identify our user with this cookie, Auth's default is 30 days
			updateAge: 0,//tell Auth.js to never refresh this cookie; it will expire naturally shortly
		},

		secret: access.get('ACCESS_AUTHJS_SIGNING_KEY_SECRET'),//Auth.js needs a random secret we define to sign things; we don't have to rotate it; generate with $ openssl rand -hex 32
	}

	return Auth(req, res, config)
})

//when code reaches here, the person at the browser connected to our server is signed into google, has told google they want to use their google account with our site, and Auth running on our server has confirmed all of this is correct with google
function proofHasArrived(account, profile) {
	console.log('proof has arrived ✉️', JSON.stringify({account, profile}))//ttd june, stringify to avoid [Object object]

	if (account.provider == 'google') {

		profile.id//like "108691239685192314259" from response.sub
		profile.name//like "Jane Doe" from response.name
		//no handle

		profile.email//like "jane.doe@gmail.com" from response.email
		profile.emailVerified = profile.response.email_verified//gmail means almost always true

	} else if (account.provider == 'twitter') {

		profile.id//like "2244994945" from response.data.id
		profile.name//like "Jane Doe" from response.data.name
		profile.handle = profile.username//like "janedoe_123" from response.data.username

		//no email

	} else if (account.provider == 'github') {

		profile.id//like 9837451 from response.id
		profile.name//like "Jane Doe" from response.name
		profile.handle = profile.login//profile.login was pulled from response.login, e.g. "janedoe"

		profile.email//like "9837451+janedoe@users.noreply.github.com" from response.email; often a disposable forwarding address if the user at github has chosen keep my email private; no email verified

	} else if (account.provider == 'discord') {

		profile.id//like "80351110224678912" from response.id
		profile.name//like "JaneDoe" from response.username
		profile.handle = `${profile.username}#${profile.response.discriminator}`//like "JaneDoe#8890"

		profile.email//like "jane.doe@gmail.com" from response.email
		profile.emailVerified = profile.response.verified//true if user has verified email with discord
	}
}

function getAccess() {//ttd june, this placeholder function is async for when we must also decrypt secrets
	const runtimeConfiguration = useRuntimeConfig()//this is how we have to get secrets through Nuxt
	return {
		get(key) {
			return runtimeConfiguration[key] ?? ''//get any existing key by name, or blank if missing
		}
	}
}
