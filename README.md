# momentum





# Install

Momentumjs requires `nodejs` or `iojs`, `jspm` for the package management and `babel-node` as development server to be installed. We currently support only `rethinkdb` as database, that will change in the future. To successfully install `momentumjs` follow the steps:

```bash
$ npm install momentumjs --save
```

add the momentumjs comandline interface to your `package.json` scripts field like so:

```json

{
	"scripts": {
    	"momentumjs": "momentumjs"
  	}
}

```

than run:

```bash
$ momentumjs install
```
# momentumjs cli
The momentumjs commandline interface provides a few tools for your development workflow.

```bash
$ momentumjs install
```
Installs the a basic skeleton for a momentumjs app in the current directory.

```bash
$ momentumjs run <options>
```
Starts the development server and serves the application.
 __Options__

 ```bash
--prod
```
Starts the server in production mode. In production the app gets bundeld via `jspm` and served as single js file.


# Custom index file
Momentumjs serves different default index files depending on the environment momentumjs is running in. If you want to override the default index file (eg. to add custom meta tags etc.) provide a `index.html` file in your app root path. The Index file must contain the following [ejs template](https://github.com/tj/ejs) tags in order to render the application correctly: 

`<%= title %>` - application title

`<%- imports %>` - script tags to import momentum and your app code

`<%- body ->` - prerenderd application html

For example:

```html
 <!doctype html>
 <html>
	<head>
	<title><%= title %></title>
	<%- imports %>
	</head>
	<body>
	<%- body %>
	</body>
</html>
```










