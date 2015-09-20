# momentum





# Installation

Momentumjs requires `nodejs` or `iojs` to be installed. We currently support only `rethinkdb` as database, that will change in the future. To successfully install `momentumjs` follow the steps:

```bash
$ npm install momentumjs --save
```

add the momentumjs executable to your `package.json` scripts field like so:

```json

{
	"scripts": {
    	"momentumjs": "momentumjs"
  	}
}

```

```bash
$ npm run momentumjs run
```

# Example Project
```bash
git clone https://github.com/wemakeweb/momentum-todomvc.git
npm install 
npm install babel -g
npm run jspm install
npm run momentumjs run
```