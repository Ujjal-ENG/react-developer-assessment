# Product Store — React Developer Assessment

A product management application built with React, TypeScript, and modern frontend tooling. It fetches product data from the [DummyJSON API](https://dummyjson.com/docs/) and provides listing, searching, filtering, detailed views, and an edit form.

## Tech Stack

| Layer              | Technology                        |
| ------------------ | --------------------------------- |
| Framework          | React 19 + TypeScript             |
| Build Tool         | Vite 8                            |
| State Management   | Redux Toolkit                     |
| Data Fetching      | RTK Query                         |
| Routing            | React Router DOM v7                |
| UI Library         | Ant Design v6                     |
| Styling            | Tailwind CSS v4 + SCSS            |
| Package Manager    | pnpm                              |

## Features

### Task 1 — Product List (`/products`)
- Ant Design Table with server-side pagination
- Configurable page size (10 / 20 / 50 per page)
- Product search via `/products/search` API
- Category filter dropdown (fetched from `/products/categories`)
- Sortable columns: Title, Price, Rating, Stock
- View action button navigating to product details

### Task 2 — Product Details (`/products/:id`)
- Dynamic routing with product ID
- Image carousel with preview support
- Full product specs: price, discount, rating, stock, dimensions, warranty, shipping, return policy
- Customer reviews section
- Loading skeleton and error state handling
- Edit button opens a side drawer

### Edit Product Drawer
- Pre-populated form with current product data
- Custom validation rules (min/max length, number ranges, required fields)
- Frontend-only save (no backend persistence required)

## Project Structure

```
src/
├── components/
│   └── layout/
│       ├── AppLayout.tsx          # Main layout with header, content, footer
│       └── AppLayout.scss
├── pages/
│   └── products/
│       ├── ProductList.tsx        # Product table with search/filter/pagination
│       ├── ProductList.scss
│       ├── ProductDetails.tsx     # Product detail view with image gallery
│       ├── ProductDetails.scss
│       ├── EditProductDrawer.tsx  # Edit form in a drawer
│       └── EditProductDrawer.scss
├── services/
│   └── productApi.ts             # RTK Query API definitions
├── store/
│   ├── index.ts                  # Redux store configuration
│   └── hooks.ts                  # Typed useDispatch / useSelector hooks
├── types/
│   ├── product.ts                # Product-related TypeScript interfaces
│   └── index.ts                  # Barrel export
├── routes.tsx                    # React Router configuration
├── App.tsx                       # Root component (Provider + Router + ConfigProvider)
├── main.tsx                      # Entry point
└── index.css                     # Tailwind CSS import + base styles
```

## Architecture Decisions

- **RTK Query** for data fetching — provides automatic caching, request deduplication, loading/error states, and tag-based cache invalidation out of the box.
- **Tailwind CSS + SCSS** — Tailwind for utility-first rapid styling, SCSS for component-scoped BEM-style rules where structured nesting is cleaner.
- **Server-side pagination** — products are fetched per page via `skip` and `limit` params instead of loading everything upfront, keeping network usage efficient.
- **Barrel exports** for types — keeps imports clean across the project.
- **Configurable base URL** — API base URL can be overridden via `APP_BASE_URL` env variable.

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 8

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/react-developer-assessment.git
cd react-developer-assessment

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
pnpm build
pnpm preview
```

## API Reference

All data is fetched from [DummyJSON](https://dummyjson.com/docs/):

| Endpoint                              | Usage                  |
| ------------------------------------- | ---------------------- |
| `GET /products?limit=N&skip=N`        | Paginated product list |
| `GET /products/search?q=keyword`      | Search products        |
| `GET /products/category/:slug`        | Filter by category     |
| `GET /products/categories`            | List all categories    |
| `GET /products/:id`                   | Product details        |
| `PUT /products/:id`                   | Update product         |
