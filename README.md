# Mini WhatsApp Chat

A small server-rendered chat application built with **Node.js**, **Express**, **MongoDB**, **Mongoose**, and **EJS**. It demonstrates the CRUD flow: list chats, create a chat, edit its message, and delete it.

## Features

- Lists chats stored in MongoDB.
- Creates a chat with a sender, recipient, message, and creation date.
- Edits the message on an existing chat.
- Deletes a chat.
- Renders HTML on the server using EJS templates.
- Serves CSS from the `public` directory.

## Requirements

- Node.js and npm.
- MongoDB running locally at `mongodb://127.0.0.1:27017`, or a MongoDB instance whose connection URI you configure in the source.

The app connects to the `whatsapp` database. MongoDB creates the database and collection when data is first written.

## Run locally

From the project directory:

```sh
npm install
node index.js
```

Open [http://localhost:8080/chats](http://localhost:8080/chats). The root path `/` currently responds with `Working man`.

To add sample records, start MongoDB and run this in another terminal:

```sh
node init.js
```

`init.js` inserts four example chats. Running it more than once inserts those examples again; it does not clear existing records.

## Routes

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/` | Simple server response (`Working man`). |
| `GET` | `/chats` | Fetches all chats and renders `views/index.ejs`. |
| `GET` | `/chats/new` | Renders the new-chat form. |
| `POST` | `/chats` | Creates a chat from submitted form fields, saves it, then redirects to `/chats`. |
| `GET` | `/chats/:id/edit` | Loads one chat and renders its edit form. |
| `PUT` | `/chats/:id` | Updates the chat message, then redirects to `/chats`. |
| `DELETE` | `/chats/:id` | Deletes a chat, then redirects to `/chats`. |

HTML forms only submit `GET` or `POST` directly. The edit and delete forms send `POST` requests with an `_method` query parameter. `method-override` reads that parameter and treats the request as `PUT` or `DELETE` before Express matches the route.

## How the code fits together

### `index.js`: Express application and routes

`index.js` creates the Express app and configures it to use the `views` directory and EJS templates. Middleware is registered before the routes:

- `express.static(path.join(__dirname, "public"))` makes files in `public` available from the website root. For example, `public/style.css` is requested as `/style.css`, which is why the templates use `<link rel="stylesheet" href="/style.css">`.
- `express.urlencoded({ extended: true })` parses URL-encoded HTML form bodies and places submitted values on `req.body`.
- `methodOverride('_method')` supports `PUT` and `DELETE` via ordinary HTML forms.

The app connects to MongoDB with Mongoose at `mongodb://127.0.0.1:27017/whatsapp`, then listens on port `8080`. Route handlers use the `Chat` model to query and modify records. Successful create, update, and delete operations redirect the browser to `/chats`, where the updated list is rendered.

### `models/chat.js`: Mongoose schema and model

The schema defines the shape and validation rules for a chat document:

- `from`: required string for the sender.
- `to`: required string for the recipient.
- `msg`: string with a maximum length of 50 characters.
- `created_at`: required date.

`mongoose.model('Chat', chatSchema)` creates the model used by the routes. Mongoose maps it to a MongoDB collection (normally named `chats`) and provides methods such as `find`, `findById`, `save`, `findByIdAndUpdate`, and `findByIdAndDelete`. MongoDB assigns each document an `_id`, which the EJS templates include in edit and delete URLs.

The update route uses `{ runValidators: true, new: true }`: it asks Mongoose to apply schema validators to the update and return the updated document. The current route does not use the returned document.

### `views/`: EJS templates

- `index.ejs` receives a `chats` array from the list route. EJS tags `<% ... %>` run JavaScript without output (used for the loop), while `<%= ... %>` inserts an escaped value into the HTML. Each chat shows its sender, message, recipient, and formatted creation date, with edit and delete forms.
- `new.ejs` contains the create form. Its `name` attributes (`from`, `to`, and `msg`) become the corresponding keys in `req.body` after URL-encoded parsing.
- `edit.ejs` receives one `chat` and pre-fills a form with its current message. The form posts to the chat URL with `_method=PUT`.

Escaped EJS output helps prevent submitted text from being interpreted as HTML. The date display in `index.ejs` uses JavaScript string splitting for a simple readable date/time.

### `public/style.css`: static styles

The stylesheet contains basic page spacing and chat/message styling. Express serves it as `/style.css` because the `public` folder is registered as a static directory.

### `init.js`: sample data

This standalone script connects to the same database and inserts four example chat documents with `Chat.insertMany`. It is a seed script, separate from the web server; it does not run automatically when `index.js` starts.

## Concepts demonstrated

- **Server-side rendering:** Express passes database results to EJS, which creates HTML on the server.
- **Middleware:** Functions such as static-file serving, form parsing, and method override run as requests pass through the app.
- **REST-style routes:** Different HTTP methods express list/read (`GET`), create (`POST`), update (`PUT`), and delete (`DELETE`) operations.
- **Forms and request data:** Form field names map to properties on `req.body`; route parameters such as `:id` are available through `req.params`.
- **Persistence and ODM:** MongoDB stores documents; Mongoose models those documents with a schema and offers query/validation methods.
- **Static assets:** CSS and other files in `public` can be served independently of EJS routes.
- **Redirect-after-submit:** After a successful mutation, the server redirects back to the list page so the browser displays current data.

## Project structure

```text
.
├── index.js          # Express app, MongoDB connection, and CRUD routes
├── init.js           # Inserts sample chats
├── models/
│   └── chat.js       # Mongoose schema and model
├── public/
│   └── style.css     # Static stylesheet
├── views/
│   ├── index.ejs     # Chat list
│   ├── new.ejs       # Create form
│   └── edit.ejs      # Edit form
├── package.json      # Dependencies and npm metadata
└── .gitignore        # Ignores node_modules
```

## Notes

- The server currently uses a hard-coded local MongoDB URI and port `8080`.
- The package currently has no start script; run it with `node index.js`.
- The `test` script in `package.json` is a placeholder and does not run an actual test suite.
- There is no custom error handling for invalid IDs, database errors during route handling, or schema validation failures; those may result in Express error responses.
