# What I Learned — Category Module

## The CRUD Pattern in This Boilerplate

Every module follows the same 5-file pattern:

```
model → validation → service → controller → route
```

1. **Model** — defines the Mongoose schema (what data looks like in MongoDB)
2. **Validation** — Joi rules that validate incoming requests before they reach the controller
3. **Service** — business logic (talking to the database, throwing errors)
4. **Controller** — glue between HTTP requests and services (reads `req`, calls service, sends `res`)
5. **Route** — maps HTTP methods + URLs to middleware chains and controllers

## Joi Validation — body vs params vs query

| Part     | Where it lives           | Example                       | Used for                       |
| -------- | ------------------------ | ----------------------------- | ------------------------------ |
| `body`   | JSON sent in the request | `{ "name": "Fiction" }`       | Creating or updating data      |
| `params` | In the URL path          | `/categories/abc123`          | Identifying WHICH resource     |
| `query`  | After `?` in the URL     | `/categories?page=1&limit=10` | Filtering, sorting, pagination |

- `params` is always an object: `Joi.object().keys({ categoryId: ... })` because Express gives you `req.params = { categoryId: "abc123" }`
- `.custom(objectId)` validates that a string is a valid MongoDB ObjectId
- `.min(1)` on an update body means "send at least one field" (useful when a model has multiple optional fields)

## CRUD Operations — What Each One Needs

| Operation | HTTP Method | URL                       | Needs         |
| --------- | ----------- | ------------------------- | ------------- |
| Create    | POST        | `/categories`             | body          |
| Get all   | GET         | `/categories?page=1`      | query         |
| Get one   | GET         | `/categories/:categoryId` | params        |
| Update    | PATCH       | `/categories/:categoryId` | params + body |
| Delete    | DELETE      | `/categories/:categoryId` | params        |

## How Frontend Uses Each Endpoint

- **Create** — admin fills a form, clicks submit → `POST /categories` with name in body
- **Get all** — page loads, need to show a list or dropdown → `GET /categories`
- **Get one** — user clicks on a specific category → `GET /categories/:id`
- **Update** — admin edits a category name, clicks save → `PATCH /categories/:id` with new name in body
- **Delete** — admin clicks trash icon → `DELETE /categories/:id`

## Error Handling

- Use `ApiError` from `../utils/ApiError` instead of plain `new Error()`
- `ApiError` takes an HTTP status code + message: `new ApiError(httpStatus.NOT_FOUND, 'Category not found')`
- Common status codes:
  - `201 CREATED` — successfully created something
  - `204 NO_CONTENT` — successfully deleted (no body in response)
  - `404 NOT_FOUND` — resource doesn't exist
  - `409 CONFLICT` — duplicate (e.g., category name already exists)

## Service Layer Patterns

- **Duplicate check before create:** `if (await Model.findOne({ name }))` → throw conflict error
- **Update with Object.assign:** `Object.assign(document, body)` then `document.save()` — cleaner than `doc.field = body.field || doc.field` and scales better with more fields
- **Don't duplicate error checks** — if the service already throws "not found", the controller doesn't need to check again

## Route Middleware Chain

Each route is a chain that runs left to right:

```
.post(auth, authorizeRoles([roles.admin]), validate(createCategory), controller.createCategory)
```

1. `auth` — checks JWT token, is the user logged in?
2. `authorizeRoles([roles.admin])` — is the user an admin?
3. `validate(...)` — does the request data pass Joi validation?
4. `controller` — runs the actual logic

- Public routes (like GET all categories) skip `auth` and `authorizeRoles`
- Admin-only routes (create, update, delete) need all middleware

## Boilerplate Plugins (toJSON, paginate)

- **toJSON** — cleans up Mongoose documents before sending to frontend (removes `__v`, converts `_id` to `id`). Every model in the boilerplate uses it.
- **paginate** — adds `.paginate(filter, options)` to the model so you can do pagination without writing it yourself. Even if you don't expect many records, use it for consistency.
- Always add both plugins to match the boilerplate pattern:
  ```js
  schema.plugin(toJSON);
  schema.plugin(paginate);
  ```

## Race Conditions & Duplicate Checks

Two ways to check for duplicates:

1. **findOne before create** — `if (await Model.findOne({ name }))` then throw error. Simple and readable.
2. **Catch MongoDB error 11000** — try/catch around `create()`, catch `error.code === 11000`. Safer because MongoDB's unique index handles it atomically — no gap between check and create.

In practice, both work for a small app. But `11000` is the "correct" approach because it avoids race conditions (two requests sneaking in at the same time).

## Utility: pick

- `pick(object, keys)` — takes an object and returns only the keys you specify
- Used in controllers to extract clean query params: `pick(req.query, ['name', 'limit', 'page'])`
- Prevents unexpected params from leaking through

## Defense in Depth (trim example)

- Joi `trim()` trims before validation
- Mongoose `trim: true` trims before saving to DB
- Why both? If someone calls the service directly without going through Joi, the model still protects the data

## Code Review Lesson

- When someone else already did the work, don't redo it — review it, learn from it, and accept it
- Comparing your code to another implementation is a great way to learn patterns you missed

## Git

- Create a feature branch before starting work: `git checkout -b feature/book-categories`
- Keep branch names descriptive: `feature/`, `fix/`, etc.
- Don't create unnecessary commits/branches for work that's already been done
