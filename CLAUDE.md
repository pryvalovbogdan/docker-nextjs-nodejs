**Tech Stack:**
- Frontend: Next.js 15.2.3 (React 19), TypeScript, Chakra UI
- Backend: Node.js 22, Express.js 4.21.2, TypeORM 0.3.20
- Database: PostgreSQL 15
- Infrastructure: Docker, Nginx, AWS (S3, CloudFront, ECR, EC2)

## Architecture

### Database Architecture (TypeORM)

**Configuration:** `/back-end/src/data-source.ts`
- **Synchronize:** `false` (always use migrations)
- **Logging:** `true`
- **Migrations Path:** `src/migrations/` (dev), `dist/migrations/` (prod)

**Three-Layer Pattern:**

1. **Repository Layer** (`/repositories/`)
   - Direct TypeORM interaction
   - Complex queries using QueryBuilder
   - Example: `ProductRepository.searchProducts()` - ILIKE across title, brand, category

2. **Service Layer** (`/services/`)
   - Business logic orchestration
   - Returns standardized format: `{ data?, errors: string[] }`
   - Example: `ProductService.deleteProduct()` - deletes product + orphaned categories

3. **Controller Layer** (`/controllers/`)
   - HTTP request/response handling
   - Uses `responseHandler` utility for consistent API responses

**Entities (6):**
- Product (with multilingual fields)
- Category (with multilingual fields)
- SubCategory (with multilingual fields)
- Order (status: 'active', 'completed', 'cancelled')
- Admin (bcrypt password, IP whitelist)
- News

**Migration Workflow:**
1. Modify entity in `/entities/`
2. Run: `yarn migration:generate -- -n DescriptiveName`
3. Review generated migration in `/migrations/`
4. Migrations auto-run on container startup via Dockerfile CMD
5. **Never use `synchronize: true`** - always use migrations

### File Upload Flow (AWS S3)

**Service:** `/back-end/src/services/S3Service.ts``

**Limits:**
- **Max images:** 3 per product/category (enforced by multer)
- **Max file size:** 50MB (Nginx: `client_max_body_size 50M`)

## API Routes

### Customer Routes (`/api/*`) - Public, Rate-Limited

```
GET  /health                       # Health check
GET  /products                     # All products (10 req/hour)
GET  /products/offset              # Paginated products
GET  /products/last-added          # Recently added
GET  /products/search/:query       # Search (20 req/min)
GET  /products/:id                 # Product by ID
GET  /categories                   # All categories
GET  /brand/:name                  # Products by brand
GET  /categories/:category         # Category details
GET  /subcategories/:name          # Subcategory details
POST /order                        # Create order (50 req/hour)
POST /contact                      # Contact form (5 req/hour)
GET  /category/:path               # Category by path
```

### Admin Routes (`/api/admin/*`) - JWT Protected

```
POST   /login                      # Admin login (no JWT needed)
POST   /register                   # Register admin (JWT required)
GET    /products                   # All products
POST   /products                   # Create product (multer: 3 images)
PUT    /products/:id               # Update product (multer: 3 images)
DELETE /products/:id               # Delete product
GET    /products/export            # Export CSV/JSON (1 req/24h)
GET    /orders                     # All orders
PUT    /orders/:id                 # Update order status
DELETE /orders/:id                 # Delete order
POST   /categories                 # Create category
PUT    /categories/:id             # Update category (multer: 3 images)
DELETE /categories/:id             # Delete category
```

**Middleware Order:** Global limiter → JWT validation → Specific limiters → Multer (if needed)

## Frontend Structure (Feature-Based)

```
/front-end/src/
├── app/[lng]/              # Next.js 15 App Router (dynamic language)
│   ├── admin/              # Admin panel pages
│   ├── product/            # Product detail pages
│   ├── category/           # Category pages
│   └── contacts/           # Contact page
├── features/               # Business logic modules (colocation)
│   ├── admin/login         # Admin authentication
│   ├── product/update-product  # Product management
│   ├── order/add-order     # Order placement
│   ├── contact/send-request    # Contact form
│   └── search/search-bar   # Product search
├── entities/               # Shared data models/types
├── shared/                 # Reusable code
│   ├── api/client.ts       # API client (fetch wrapper)
│   ├── ui/                 # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   └── theme/              # Chakra UI theme config
├── widgets/                # Complex UI components
└── i18n/                   # Internationalization
    └── locales/{lang}/     # Translation JSON files
```

## Docker Architecture

### Development (`docker-compose.yaml`)

**Services:**
- `db`: PostgreSQL 15-alpine, local volume (`./data`)
- `server`: Dockerfile.dev, hot reload (ts-node-dev)
- `client`: Dockerfile.dev, Next.js dev mode
- `nginx`: Reverse proxy

## Environment Variables

**Required Variables:**
```env
# Database
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
DB_HOST=db                  # Docker service name
DB_PORT=5432

# JWT
JWT_SECRET=

# Email (Gmail SMTP)
EMAIL_USER=
EMAIL_PASS=                 # App-specific password

# AWS S3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
S3_BUCKET_NAME=
CLOUDFRONT_DOMAIN=

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=

# Admin Setup
ADMIN_EMAIL=
ADMIN_PASSWORD=
PRIMARY_ADMIN_IP=
SECONDARY_ADMIN_IP=

# Domain
DOMAIN=                     # Production domain

# OpenAI (auto-translation)
OPENAI_API_KEY=

# Inter-Service (Docker)
BACKEND_URL=
```

## Important Conventions

### 1. Migration Naming
- Format: `{timestamp}-{DescriptiveName}.ts`
- Example: `1755371994444-AddRuTranslationsToCategoriesAndSubcategories.ts`
- Always commit migrations to version control

## Development Workflow

### Adding New Features

1. **Backend:**
   - Add entity in `/entities/` (if needed)
   - Generate migration: `yarn migration:generate -- -n FeatureName`
   - Create repository in `/repositories/`
   - Create service in `/services/`
   - Create controller in `/controllers/`
   - Add routes to `/routes/customer.ts` or `/routes/admin.ts`
   - Update Swagger if needed: `yarn swagger-gen`

2. **Frontend:**
   - Create feature module in `/features/`
   - Add page in `/app/[lng]/`
   - Create API client calls in feature or `/shared/api/`
   - Add translations to `/i18n/locales/{lang}/`

**Production:**
- Deployed on AWS EC2 with CloudFront CDN
- when making new page components, always add a link to that page in the header