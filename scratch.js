

/*
let's work entirely in the code for a few minutes, checking each section for each provider
below is our section for Google
for this and following sections, we must confirm that each of the following is complete and correct

- the import for the provider is correct,
- and the constructor in the providers array is correct.
- for authorization, code should show what we are specifying, following the simple common best practice of using oauth to let a user, just for right now, prove to our server that they control a third party social media account (more code beyond this example will create a new user, sign that user into this browser, and record that their identity is validated through again proving they control this social account; all that is outside the scope of what we are doing here--here we are confirming that we're correctly using @auth/core with the third party oauth apis)

if the provider very commonly uses email for user identification (google and github do; it's possible these are the only two in our list of providers) *AND* if we can get the user's email address without needing to request a higher or more difficult level of authorization, then we want to get the email and know if the user has validated the email. otherwise, we should leave email out of this, keeping things simple to be reliable and resiliant

the code snippet below shows how we can read different properties on the profile object
i need your help to make sure this example of reading properties is complete and correct
and, it's quite specific to how the third party provider's api endpoint responds, and how they are using and have implemented oauth
it also may be specific to details about @auth/core
complete means that we've identified relevant and useful information that is likely to be included in the object
correct means that the comment for each indicates correctly
- the type, like when a number is returned as numerals in a text string
- an example, using made up but common and likely placeholder or "Jane Doe"-style text
- the definition of the property, as in, how the provider names it and what the provider says it is

most third party sites let users change or update their name
many have a restricted user name, and a more flexible display name. the user name might need to be unique, and be part of a domain route, while the display name might just render onto the page, for instance
so, in these comments i also want to know how the ids and names relate in this way, and what indended uses or guarantees the site makes about them

ok, let's get started, to begin, please check our example for Google below
i think you may need to reword and expand comments, but the code will be the same

note the style below, please match single line comments (even if lines are long; we all have word wrap on here), single quotes for strings, no spaces before or after the // which starts a comment
*/

import {Auth} from '@auth/core'
import Google from '@auth/core/providers/google'
export default Auth({
	providers:[
		Google({//Google OAuth 2.0 via OpenID Connect; minimal scopes to prove account ownership and fetch basic profile info
			clientId:      process.env.AUTH_GOOGLE_ID,
			clientSecret:  process.env.AUTH_GOOGLE_SECRET,
			authorization: {params: {scope: 'openid profile email'}},//request standard OIDC scopes: subject (sub), profile (name, picture), email
			profile: (raw) => ({//map Google’s UserInfo response to Auth.js profile
				id:             raw.sub,
				name:           raw.name,
				email:          raw.email,
				image:          raw.picture,
				email_verified: raw.email_verified//google gives us email verified, but auth hides it without this custom mapper to reveal it
			})
		})
	],
	callbacks:{
		async jwt({token,profile}) {
			if (profile){
				profile.id//'109876543210123456789' (string): stable Google account ID
				profile.name//'Alice Johnson' (string): user’s display name
				profile.email//'alice@example.com' (string|null): verified email or null
				profile.email_verified//true (boolean): email verification status
				profile.image//'https://lh3.googleusercontent.com/a/AAc…' (string|null): profile photo URL
			}
			return token
		}
	}
})


/*
ok, look at this example for twitter. for each example we work on, i want to be sure we get the comments right
(a) details what api version protocol standard we're using here
(b) states what we're requesting, and if it's different than the default
(c) identifies which property or properties caused us to include our own profile mapping function
(d) for each property here, i want
- what the property is, generally
- what the platform calls this property (matching their documentation or their user guides)
- example, using made up but common user name information
- how this property is different or distinct from others (doesn't change if the user changes her name, or, normalized to be lowercase)
*/


/*
ok, below i have drafts of google and twitter, those two sections, of our larger document
without specifically labeling comments (a), (b), etc, there are comments in each section that describe
- what version and api and protocol we'reu sing "oauth 2.0 via openid connect"
- what our scope is, what the default is, why it's different if it is different
- what property makes it so that we have to specify our own profile mapping function
and then for each property
- an example of waht it looks like, using "Jane Doe"'s information
- what is is, what the third party provider calls it, what users know it as
- type and presence, like (string|null)

please give everything here a final check, and then we'll use this format as the model for future sections!
*/



/*
our goal is to use oauth to let users to our site sign up or log in by proving they control an account at a third party
our aim is to keep things simple, following best practices, choosing minimal scope to accomplish our task

in the profile information we get from the provider (and through auth core) we're looking for the following

- some identifier that doesn't change, even if the user updates their screen name
- a more simple, more normalized name
- the name but for display on pages, so here it might contain spaces and emoji
and, some notes on email: we only want email if it's easy to get, that is (1) most users of this platform have email defined through the platform (this is the case for google accounts which have gmail, for instance) *AND* (2) we can get the email without needing to request additional permissions, or make an additional API call (so essentially we want to get email when it's likely to already be there!) and then if we can get email, we want
- email address
- boolean if the platform has proven that the user controls that address

ok, with that in mind, tell me what if anything should change in the google and twitter sections
and then draft for me the new GitHub and Discord section at the bottom
*/




//Yes—Auth.js Core’s built-in types assume every profile object has all four of its canonical fields:
type DefaultProfile = {
	id: string
	name: string | null
	email: string | null
	image: string | null
}





//google
import { Auth } from "@auth/core"
import googleProvider from "@auth/core/providers/google"
const googleConfiguration = googleProvider({ // using Google’s OAuth 2.0 via OpenID Connect; minimal scopes to prove account ownership and fetch basic profile info
	clientId:     process.env.AUTH_GOOGLE_ID,
	clientSecret: process.env.AUTH_GOOGLE_SECRET,
})
const googleProfile = googleConfiguration.profile
googleConfiguration.profile = async (raw) => {
	const user = await googleProfile(raw)
	return {
		...user,
		email_verified: raw.email_verified
	}
}
export default Auth({
	providers: [googleConfiguration],
	callbacks: {
		async jwt({ token, profile }) {
			if (profile) {
				//standard properties
				profile.id // '109876543210123456789' (string): stable Google account ID
				profile.name // 'Alice Johnson' (string): user’s display name
				profile.email // 'alice@example.com' (string|null): verified email or null
				profile.image // 'https://lh3.googleusercontent.com/a/AAc…' (string|null): profile photo URL
				//additional properties
				profile.email_verified // true (boolean): email verification status
			}
			return token;
		}
	}
})

//x previously twitter
import { Auth } from "@auth/core"
import twitterProvider from "@auth/core/providers/twitter"
const twitterConfiguration = twitterProvider({ // using X API v2 via OAuth 2.0 (PKCE)
	clientId:      process.env.AUTH_TWITTER_ID,
	clientSecret:  process.env.AUTH_TWITTER_SECRET,
	authorization: { params: { scope: "users.read" } } // only request the minimal users.read scope; default is "users.read tweet.read offline.access" which would require approval for refresh tokens, and tell the user the site could see tweets
})
const twitterProfile = twitterConfiguration.profile
twitterConfiguration.profile = async (raw) => {
	const user = await twitterProfile(raw)
	return {
		...user,
		username: raw.data.username // "janedoe" (string; platform calls this “username”; unique handle for URLs/routes; user‐editable; can change)
	}
}
export default Auth({
	providers: [twitterConfiguration],
	callbacks: {
		async jwt({ token, profile }) {
			if (profile) {
				//standard properties
				profile.id // "2244994945" (string; immutable user ID)
				profile.name // "Jane Doe" (string; free-form display name; highly variable)
				profile.email // probably null?
				profile.image // "https://…_normal.jpg" (string|null; “profile_image_url”; avatar URL)
				//additional properties
				profile.username // "janedoe" (string; unique handle for URLs/routes; user‐editable; can change) must specify profile function to get this one
			}
			return token
		}
	}
})

//github
import { Auth } from "@auth/core"
import githubProvider from "@auth/core/providers/github"
const githubConfiguration = githubProvider({ // using GitHub’s OAuth 2.0 Web Application Flow
	clientId:     process.env.AUTH_GITHUB_ID,
	clientSecret: process.env.AUTH_GITHUB_SECRET,
})
const githubProfile = githubConfiguration.profile
githubConfiguration.profile = async (raw) => { // custom mapping required to expose `login`
	const user = await githubProfile(raw);
	return {
		...user,
		login: raw.login // "janedoe" (string; platform calls this “login”; unique URL handle; user-editable; can change)
	}
}
export default Auth({
	providers: [githubConfiguration],
	callbacks: {
		async jwt({ token, profile }) {
			if (profile) {
				//standard properties
				profile.id // "1234567" (string): immutable GitHub user ID
				profile.name // "Jane Doe" (string|null): display name; user-editable; may be null
				profile.email // "jane@example.com" (string|null): primary email if returned; null otherwise
				profile.image // "https://…/avatar" (string|null): avatar URL (from `avatar_url`); null if none
				//additional properties
				profile.login // "janedoe" (string): unique handle for URLs; user-editable; can change
			}
			return token
		}
	}
})

//discord
import { Auth } from "@auth/core"
import discordProvider from "@auth/core/providers/discord"
const discordConfiguration = discordProvider({ // using Discord’s OAuth 2.0 (identify + email)
	clientId:     process.env.AUTH_DISCORD_ID,
	clientSecret: process.env.AUTH_DISCORD_SECRET,
})
const discordProfile = discordConfiguration.profile
discordConfiguration.profile = async (raw) => { // custom mapping required to expose `discriminator` and `email_verified`
	const user = await discordProfile(raw)
	return {
		...user,
		discriminator:  raw.discriminator, // "1234" (string; platform calls this “discriminator”; 4-digit suffix for uniqueness; user-editable)
		email_verified: raw.verified // true (boolean; platform calls this “verified”; whether Discord has verified the email)
	}
}
export default Auth({
	providers: [discordConfiguration],
	callbacks: {
		async jwt({ token, profile }) {
			if (profile) {
				//standard properties
				profile.id // "80351110224678912" (string): immutable Discord user ID
				profile.name // "janedoe" (string): platform calls this username (mapped as `name` by default)
				profile.email // "janedoe@example.com" (string|null): primary email if returned; null otherwise
				profile.image // "https://cdn.discordapp.com/avatars/…​.png" (string|null): constructed avatar URL
				//additional properties
				profile.discriminator  // "1234" (string): four-digit suffix added above
				profile.email_verified // true (boolean): email verification status added above
			}
			return token
		}
	}
})

//twitch
import { Auth } from "@auth/core"
import twitchProvider from "@auth/core/providers/twitch"
const twitchConfiguration = twitchProvider({ // using Twitch’s OAuth 2.0 via OpenID Connect; minimal scope to prove account ownership
	clientId:     process.env.AUTH_TWITCH_ID,
	clientSecret: process.env.AUTH_TWITCH_SECRET,
})
export default Auth({
	providers: [twitchConfiguration],
	callbacks: {
		async jwt({ token, profile }) {
			if (profile) {
				// standard properties
				profile.id // "1234567890" (string): platform calls this “sub”; immutable Twitch user ID
				profile.name // "twitchuser" (string): platform calls this “preferred_username”; login handle for URLs; lowercase alphanumeric unique
				profile.image // "https://…/avatar.png" (string|null): platform calls this “picture”; profile photo URL
			}
			return token
		}
	}
})

//reddit
import { Auth } from "@auth/core"
import redditProvider from "@auth/core/providers/reddit"
const redditConfiguration = redditProvider({ // using Reddit’s OAuth 2.0; minimal identity scope
	clientId:     process.env.AUTH_REDDIT_ID,
	clientSecret: process.env.AUTH_REDDIT_SECRET,
})
export default Auth({
	providers: [redditConfiguration],
	callbacks: {
		async jwt({ token, profile }) {
			if (profile) {
				//standard properties
				profile.id // "t2_1a2b3c" (string): platform calls this “id”; immutable Reddit user ID
				profile.name // "example_user" (string): platform calls this “name”; login handle for URLs and mentions; unique
				profile.image // "https://styles.redditmedia.com/...png" (string|null): platform calls this “icon_img”; profile avatar URL
			}
			return token
		}
	}
})


























