# momentum





# Install

Momentumjs requires `nodejs` or `iojs` to be installed. We currently support only `rethinkdb` as database, that will change in the future. To install successful install `momentumjs` following the following steps:

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










