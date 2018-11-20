# UWA Sites Index

This is an interface of a database that details the Infrastructure around campus, their datails, and the possible sensors that can be used on them.

### Contents
 1. [Technologies Used](#technologies-used)
 2. [Installation](#Installation)
 3. [Styling](#Styling)
 4. [Templating](#Templating)
 5. [Routing](#Routing)
 6. [Database](#Database)


## Technologies Used

  - [MongoDB](https://www.mongodb.com/) - Document based (NoSQL) database, easily scalable and allows for dynamic manipulation of the database.
  - [KeystoneJS](https://keystonejs.com/) - A JavaScript framework that allows quick and easy access to the database through a dynamically generated admin interface.
    - [Express](https://expressjs.com/) - Web routing framework for Node.js, allows for easy definition of the routes used for displaying the data.
    - [Mongoose](https://mongoosejs.com) - A DB model abstraction that allows the definition of schemas to stucture the data accepted by specific documents.
    - [Handlebars](https://handlebarsjs.com) - A powerful HTML templating language used by the backend to dynamically inject data into the frontend html.
    - [Cloudinary](https://cloudinary.com) - Hosts image files automagically.
  - [UIKit](https://getuikit.com) A simple HTML/CSS frontend for quickly generating pretty frontend views for the data.
  - [Google Maps](https://maps.google.com) - Using the embeded method in iframes to display locations on a map.


## Installation

1. clone this repo into a folder of your choosing, enter the folder
2. run `npm i` to install the dependancies
3. setup the `.env` file detailed below
4. run `npm start` to start the server

### `.env` file

**NB:** The vaules used in the SHL site can be found in the google drive in `UWA SHL/Projects/Living Lab/sites-index-env.txt`

The `.env` file contains the enviroment variables and can contain the following: (* are required)
```ini
MONGO_URI=<*mongodb-uri>
CLOUDINARY_URL=<*coudinary-url>
COOKIE_SECRET=<*cookie-secret>
NODE_ENV=<development/production>
PORT=<port>
```

The values mean the following:
  - `mongodb-uri`: The [connection URI](https://docs.mongodb.com/manual/reference/connection-string/) to the [mongo database](https://www.mongodb.com/), a uri for a local database would look like `monogodb://localhost:27017/uwa-sites-index`
  - `cloudinary`: The URI that contains the API credentials for a [cloudinary](https://cloudinary.com) account. You can get this by registering for free.
  - `cookie-secret`: A long random string that is used to cryptographically secure session cookies, the longer, the better.
  - `development/production`: Defaults to `development`, define this as `production` when deploying.
  - `port`: The port to run the server on, defaults to `3000`.

## Styling

Most of the styling for this site is done by the default [UIKit](https://getuikit.com) framework.

Custom styling is done in [stylus](http://stylus-lang.com) located in the `public/styles/site/_layout.styl` file. After making changes, run `npm run compile` to transpile stylus into css.

## Templating

The data displayed is built from handlebars templates. This is broken up for easy maintenance.

This briefly covers the basics of handlebars, for a more in-depth explinations please consult the [Documentation](https://handlebarsjs.com/).

### Header, Navbar, and Footer

These are defined as a "layout" in the `/templates/views/layoutes/` folder. The default layout is approprately named `default.hbs`.

The main body of a page is loaded into the section specified with a `{{{body}}}` field.

To use a cutom layout on a page, add `{{!< ~layout~}}` to the top of the page. (replacing `~layout~` with the name of the layout)

### Pages

The specific page template is defined in the `/templates/views/` folder. 

The website runs off of three main views, `find.hbs`, `get.hbs`, and `index.hbs`:
  - `find.hbs`: Displays any collection(table) of data.
  - `get.hbs`: Displays a single document(row) from any collection.
  - `index.hbs`: Dispays the homepage.


**Why is there no specific pages for specific collections?**

Good question. As all of the collections contain similar types of data between one another, we make sure that similar types have a consistant field name in the document. This allows the templates to blindly display the data based on the names of the fields present.

These field names used are, but not limited to:
  - `name`: the name of the document
  - `desc`: the description of the document
  - `qty`: the quantity of an item
  - `age`: the date of the start of something (like a DOB)
  - `examples`: a list of examples (example problem/solution satements), these are stored as a single string, deliminated by "` | `"
  - `images`: an array of cloudinary images, if present, will render a slideshow at the top of a get page
  - `coords`: a tuple of geo coordinates, stored as `[long, lat]`, if present will render a map at the top of the get page. Will also display as a link that, when clicked on, will open up the map in a dismissable view
  - `classes`: an array of classifier documents associated with the current document
  - `infra`: an array of infrastructure documents associated with the current document
  - `sensors`: an array of sensor documents associated with the current document
  - `faults`: an array of fault documents associated with the current document
  - `location`: a single location document associated with the current document. Will display as a link that, when clicked on, will open up the map in a dismissable view


### Partials

Partials are repaetable components used in the templates, and are located in `/templates/views/partials` and can be called in the layouts/pages by using `{{>~partial~}}` (replacing `~partial~` with the partials name)

### Helpers

Helpers are javascript functions that can be called on data from within the templates, an example of this would be `{{date age format="MM YYYY"}}` which takes a [Date object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) (`age`) and returns a pretty and formatted string using a [moment.js](https://momentjs.com/) template (`format="MM YYYY"`).

These are defined in `/templates/views/helpers/index.js`

## Routing

The backend uses express to route incoming connections to certain views/data, further reading can be done at [Express's documentation.](https://expressjs.com/)

### Routes

The routes available are defined in `/routes/views/index.js`, an sample is bellow:

```js
app.get('/', routes.views.index);
  
app.get('/infrastructure/', middleware.requireUser, routes.views.find);
app.get('/infrastructure/:class', middleware.requireUser, routes.views.find);
app.get('/piece/:slug', middleware.requireUser, routes.views.get);
```
You can use `app.get`, `app.post`, `app.patch`, `app.delete`, `app.put`, and `app.use` (catch-all) to handle the actions to take for different [HTTP Methods](https://restfulapi.net/http-methods/) they use the following argument pattern:
 - first arg - tells what path to use for the view, segments with a `:parameter` make the defined parameter available in `req.params`.
 - middle-args - define middleware to use before we call the final view, as seen above, `middleware.requireUser` will block a request if a user is not logged in.
 - last-arg - the final view that will call `res.render()`, the data is usually loading from the database in this function.

### Rendering

The view functions used as the last arg in a route are defined in the folder `/routes/views/`. Inside these, [Mongoose Queries](https://mongoosejs.com/docs/queries.html) are used to load the data from the database, and store the data in the `res.locals` field.

Once a view has finished loading the data, it will call `res.render('page')` which will pass the `res.locals` field to the template as the rendering context, and then send the finished render to the client.

### Navbar

The definition that is used to build the navbar can be found in `/routes/middleware.js`. It should look like:

```js
res.locals.navLinks = [
		{ label: 'Home', key: 'home', href: '/' },
		...(!req.user ? [] : [ //only display the following if logged in
			{ label: 'Infrastructure', key: 'infrastructure', href: '/infrastructure' },
			{ label: 'Sensors', key: 'sensors', href: '/sensors' },
			{ label: 'Classifiers', key: 'classifiers', href: '/classifiers' },
			{ label: 'Faults', key: 'faults', href: '/faults' },
			{ label: 'Locations', key: 'locations', href: '/locations' },
		]),
	];
```

## Database

The Model/Schema definitions for the Mongo collections(tables) are defined in the `/models/` directory. For further information, please read the [Model](https://mongoosejs.com/docs/models.html) and [Schema](https://mongoosejs.com/docs/guide.html) documentation.

### Schema

The schema defines what fields the backend should allow, their type, defaults, whether they are required, and other information about the structure of the data.

Keystone provides a [comprehensive list of data types/options it supports.](https://keystonejs.com/api/field/options) Along with the default [Mongoose options.](https://mongoosejs.com/docs/schematypes.html)

An example schema definition:
```js
Sensors.add({
  name: {
    type: String, // just a plain string
    required: true, // must be defined
    initial: true,  // show in the create pop-up
  },
	desc: {
    type: Types.Markdown, // is text formatted as markdown,
      // saved in the document as {html: '<b>bold</b>', md: '**bold**'}, 
      // will show in a wysiwyg editor in the admin interface.
    initial: true
  },
	classes: {
    type: Types.Relationship, // is a relationship with another collection
    ref: 'Classifiers', // the collection in relation
    many: true, // one-to-many/many-to-many relationship 
    initial: true,
  },
	images: {
    type: Types.CloudinaryImages // and array of image information that is stored in cloudinary
  },
	examples: {
		type: Types.TextArray, // an array of text, stored as a string delimited by " | "
		label: 'Example Solution Statements', // custom label for the field to show in the admin interface
		initial: true,
	},
});
```

### Models/Lists

A Model defines the ways in which the data can/is read and written to the database.

Keystone provides it's own wrapper around Models called Lists, which add [extra options.](https://keystonejs.com/api/list/options)

An example of initialising a Model/List:
```js
var Sensors = new keystone.List('Sensors', {
	autokey: { path: 'slug', from: 'name', unique: true }, //automagically creates the slug based on the name of the document
	track: true, // adds createdAt, updatedAt, createdBy and updatedBy
	drilldown: 'classes', // tells admin interface to populate the `classes` dropdown menu with the names of the available classses.
});
```

The following things can also be defined with a Model/List:
  - [Virtuals](https://mongoosejs.com/docs/guide.html#virtuals): data that is calculated and then added to a document when being read from the database, but the data is not stored in the database.
  - [Models](https://mongoosejs.com/docs/guide.html#methods): functions that are attached to a document, and operate in the context of the document.
  - [Statics](https://mongoosejs.com/docs/guide.html#statics): static functions attached to the model itself, and operated in the context of the model. Usually used to abstract complex search queries.
  - [Query Helpers](https://mongoosejs.com/docs/guide.html#query-helpers): functions that are attached to a query, and operated in the context of that query.

### Queries

Querying in mongo can be a little confusing but very powerful.

Explaining mongo queries is a little out of the scope of this document, but here are some resources:

  - [Mongoose documentation on queries.](https://mongoosejs.com/docs/queries.html)
  - [Mongo docs on query syntax](https://docs.mongodb.com/manual/tutorial/query-documents/)
  - [Fun video](https://www.youtube.com/watch?v=pxHmq37aWuE)

An example of a mongoose query:
```js
keystone.list('Classifiers').model // get the Classifiers Mongoose model
  .findOne({ slug: locals.filters.class }) // get one doc with the matching slug
  .exec(function (err, result) { // execute the query and return this function when done
    locals.data.class = result;
    next(err);
  });
```
Another way of writing this is:
```js
keystone.list('Classifiers').model
  .findOne()
  .where('slug')
  .equals(locals.filters.class)
  .exec(function (err, result) {
    locals.data.class = result;
    next(err);
  });
```
Or even `.where('slug', locals.filters.class)`