# ara.team

Static website [ara.team](https://ara.team/) hosted on [Cloudflare Pages](https://pages.cloudflare.com/).

Notes

```
desktop browser, github.com, new repo, example.com name, public or private
yes readme, node gitignore, gpl3 license

$ git clone https://github.com/username/example.com
$ cd example.com
$ npm init
$ npm install -D wrangler
$ mkdir public_html

desktop browser, sign into github and cloudflare

$ git clone https://github.com/username/example.com
$ cd example.com
$ npm install

$ npx wrangler version
$ npx wrangler login
$ npx wrangler whoami

$ npx wrangler pages project create example.com --production-branch main
$ npx wrangler pages deploy public_html

package.json:

  "scripts": {
    "pages:deploy": "wrangler pages deploy ./public_html --project-name example.com"
  },

$ npm run pages:deploy

$ npm install -g serve
$ serve --version
$ serve public_html
```
