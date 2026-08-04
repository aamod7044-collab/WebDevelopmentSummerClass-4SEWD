# Inventory Management System — Full-Stack Coursework Build

This is a complete implementation of the **Inventory Management System** case study from your
coursework brief: SQLite database (Sequelize, code-first) → Express REST API → React (Vite)
client, secured with JWT admin login.

This README is written to be read, not skimmed — it explains **why** the code is structured the
way it is, so you can confidently explain it in your week 8 live demonstration.

---

## 1. How the three layers talk to each other

```
┌─────────────────┐        HTTP + JWT         ┌──────────────────┐        Sequelize (SQL)      ┌─────────────────┐
│   React (Vite)   │  ──────────────────────►  │   Express API     │  ──────────────────────►    │  SQLite file     │
│   localhost:5173 │  ◄──────────────────────  │   localhost:5000  │  ◄──────────────────────    │  data/inventory  │
└─────────────────┘        JSON responses      └──────────────────┘        rows/results          │  .sqlite         │
                                                                                                    └─────────────────┘
```

- The **client** never talks to the database directly. It only ever calls the API over HTTP.
- The **API** never trusts the client. Every write is re-validated server-side, and every
  protected route re-checks the JWT — even though the React app also checks these things for a
  better user experience.
- The **database** is a single file (`server/data/inventory.sqlite`). Sequelize turns your
  JavaScript model definitions (`server/src/models/*.js`) into SQL tables automatically — this is
  the "code-first database design" the brief asks for. You never hand-write `CREATE TABLE`.

---

## 2. Project structure

```
inventory-management-system/
├── server/                      # Express API (Node.js)
│   ├── src/
│   │   ├── config/db.js         # Sequelize connection to the SQLite file
│   │   ├── models/               # Code-first schema: User, Supplier, Product + relationships
│   │   ├── middleware/           # auth.js (JWT check), upload.js (Multer), errorHandler.js
│   │   ├── controllers/          # Business logic for each resource
│   │   ├── routes/               # Maps URLs + HTTP verbs -> controller functions
│   │   ├── validators/           # express-validator rules (server-side validation)
│   │   ├── app.js                # Express app: middleware + routes wired together
│   │   ├── server.js             # Entry point: connects DB, starts listening
│   │   └── seed.js               # Creates the admin user + sample data
│   ├── uploads/                  # Uploaded product images land here
│   ├── .env.example              # Copy to .env - never commit the real .env
│   └── package.json
│
└── client/                      # React app (Vite)
    └── src/
        ├── api/axios.js          # Central HTTP client; attaches JWT to every request
        ├── context/AuthContext.jsx  # Tracks who's logged in, exposes login()/logout()
        ├── components/
        │   ├── PrivateRoute.jsx  # Redirects to /login if not authenticated
        │   └── Layout.jsx        # Sidebar nav + mobile menu, wraps every protected page
        ├── pages/                # One file per screen (Login, ProductList, ProductForm, ...)
        └── styles/global.css     # All styling - a single design-token-driven stylesheet
```

Notice the **separation of concerns** inside `server/src`: a request for
`PUT /api/products/5` flows through `routes → middleware (auth, upload, validation) →
controller → model`. Each layer only knows about the layer next to it. This is exactly what
the "Code Organisation & Best Practice" mark scheme line is looking for.

---

## 3. Setting it up and running it yourself

### Prerequisites
- Node.js 18+ installed
- Two terminal windows/tabs (one for the server, one for the client)

### Step 1 — Backend

```bash
cd server
npm install
cp .env.example .env        # then open .env and set your own JWT_SECRET
npm run seed                # creates the SQLite file, an admin user, and sample data
npm run dev                 # starts the API on http://localhost:5000
```

The seed script prints the admin username. The password comes from `ADMIN_PASSWORD` in your
`.env` (default `Admin123!` — change it before you submit/demo).

### Step 2 — Frontend

In a second terminal:

```bash
cd client
npm install
npm run dev                 # starts the React app on http://localhost:5173
```

Open `http://localhost:5173`, log in with your admin credentials, and you're in.

> Why two servers in development? Vite serves your React code with instant hot-reload, and
> proxies any `/api/...` call to Express (see `vite.config.js`). In production you'd build the
> client (`npm run build`) and have Express serve the compiled static files from one origin —
> I've explained how to do that in section 6 below (Deployment).

---

## 4. How each requirement from the brief is satisfied

| Brief requirement | Where it lives | How it works |
|---|---|---|
| Code-first DB design | `server/src/models/*.js` | You define JS classes; `sequelize.sync()` in `server.js` generates the actual SQL tables from them on startup. |
| Products ↔ Suppliers relationship | `server/src/models/index.js` | `Supplier.hasMany(Product)` / `Product.belongsTo(Supplier)` creates a `supplierId` foreign key column. The UI shows the supplier's **name**, never a raw ID (see `ProductList.jsx`, `ProductView.jsx`). |
| Low-stock alert (red, <5 units) | `ProductList.jsx`, `global.css` | Any row where `quantity < 5` gets the `.low-stock-row` class (red background) and a "Low stock" badge. |
| Search + supplier filter | `ProductList.jsx` (client), `productController.js` (server) | Client sends `?search=...&supplierId=...` query params; the server builds a Sequelize `WHERE` clause with `Op.like` for partial name matches. |
| Image upload (real file, not URL) | `middleware/upload.js` (Multer), `ProductForm.jsx` | The form uses `<input type="file">` inside `multipart/form-data`. Multer saves the file to `server/uploads/` and rejects anything that isn't an image MIME type. |
| Admin login | `authController.js`, `Login.jsx` | Username/password checked against the `users` table; bcrypt compares the hash. |
| Hashed passwords | `models/User.js`, `seed.js` | `bcrypt.hash()` on the way in, `bcrypt.compare()` on login. The plain password is never stored or logged. |
| Route protection (can't view/edit without login) | `middleware/auth.js` (server), `PrivateRoute.jsx` (client) | Every product/supplier API route has `router.use(requireAuth)`. On the frontend, `PrivateRoute` redirects to `/login` if there's no valid token, and the axios interceptor force-logs-out on any 401 response. |
| Client + server validation | `ProductForm.jsx`/`SupplierForm.jsx` (client), `validators/*.js` (server) | The form blocks obviously-bad input immediately. The server re-checks everything with `express-validator` + Sequelize model validators — because a client check can always be bypassed (e.g. via Postman), so the **server is the real gatekeeper**. |
| Clear, specific error messages | Everywhere | `errorHandler.js` turns Sequelize/Multer/validation errors into a JSON `{ message, errors }` the frontend actually displays, instead of a generic "error occurred." |
| Responsive frontend | `global.css` | Sidebar becomes a slide-down mobile menu under 720px; the product table scrolls horizontally on small screens instead of breaking; forms collapse to a single column. |
| RESTful API design | `server/src/routes/*.js` | `GET/POST/PUT/DELETE /api/products`, `/api/products/:id`, same pattern for `/api/suppliers`; correct status codes (400 validation, 401 auth, 404 not found). |

---

## 5. Things worth understanding deeply for your demo

**Why JWT and not sessions?**
A JWT is a signed token the server hands the client after login. The client stores it
(`localStorage`, see `AuthContext.jsx`) and sends it back on every request in the
`Authorization: Bearer <token>` header. The server verifies the signature with `JWT_SECRET` — it
doesn't need to store session state anywhere, which is why this pattern is common for APIs
consumed by separate frontend apps.

**Why is validation duplicated on client and server?**
They serve different jobs. Client-side validation is about *user experience* — instant feedback
without a network round trip. Server-side validation is about *security and data integrity* —
someone could always call your API directly with curl/Postman and skip the React form entirely,
so the server must never assume the data is clean.

**Why does deleting a supplier with linked products get blocked?**
See `supplierController.js` → `deleteSupplier`. This isn't strictly required by the brief, but it
prevents silently orphaning data and is the kind of design decision worth mentioning live — it
shows you're thinking about referential integrity, not just satisfying a checklist.

**Why `Op.like` for search instead of loading everything and filtering in React?**
Filtering in the database scales — with 10,000 products you don't want to ship the whole table
to the browser just to filter 5 rows. It also means the same filter logic protects your API
against people hitting it directly.

---

## 6. Deployment (worth 10% of your grade)

You need the app reachable on the internet, not just `localhost`. A simple, free-tier-friendly
route:

1. **Backend**: deploy `server/` to a Node-friendly host (Render, Railway, Fly.io all have free
   tiers). Set the same environment variables from `.env` in the host's dashboard — never commit
   `.env` itself. SQLite's file-based storage means you should pick a host with persistent disk
   (Render's free disks, or a small volume) so your data survives restarts.
2. **Frontend**: run `npm run build` inside `client/` to produce static files in `client/dist/`,
   then either:
   - Deploy `dist/` to a static host (Netlify, Vercel, GitHub Pages) and point it at your deployed
     API's URL (you'll need to change `axios.js`'s `baseURL` to the full API URL, and remove the
     Vite dev-only proxy), **or**
   - Have Express itself serve the built files (`app.use(express.static(path.join(__dirname, "../../client/dist")))`)
     so frontend and backend are one deployment.
3. Update CORS in `app.js` if frontend and backend end up on different domains — right now
   `cors()` allows everything, which is fine for coursework but worth mentioning you'd lock it
   down in a real production app.

## 7. Git history (worth 10%)

Don't just `git init && git add . && git commit -m "final"`. Initialize the repo now, and commit
in small, meaningful chunks as you make further changes (e.g. "Add supplier delete protection",
"Add low-stock badge styling", "Add search debounce"). Two options:
- One repo at the project root with both `server/` and `client/` inside it, **or**
- Two repos, one per folder, if your tutor prefers that structure.

Either way, add a `.gitignore` (already provided in both folders) so `node_modules/`, `.env`, and
the SQLite database file are never committed.

---

## 8. Default login (change before submitting)

```
username: admin
password: Admin123!   (set via ADMIN_PASSWORD in server/.env before running `npm run seed`)
```

## 9. What I verified myself before handing this to you

I actually ran this stack end-to-end rather than just writing code from memory:
- Installed both `server` and `client` dependencies
- Seeded the database and confirmed the admin user + sample products/suppliers were created
- Started the API and confirmed: login issues a real JWT, unauthenticated requests are rejected
  with 401, product listing correctly joins in supplier names, and a negative price is rejected
  with a clear validation message
- Started the Vite dev server and confirmed the proxy correctly forwards `/api` calls through to
  Express
- Ran a full production build of the client with zero errors

You're getting a stack that already runs, not just code that looks plausible.
