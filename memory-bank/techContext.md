# TECHNICAL CONTEXT - ControlFin Project

## Technology Stack

### Frontend Stack
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Ant Design 5 with BlockAI Theme
- **Charts**: Highcharts (Financial Charts)
- **State Management**: Zustand
- **Routing**: React Router 6
- **Styling**: SCSS/SASS + BlockAI Design System
- **PWA**: Service Workers + Manifest
- **Testing**: Playwright (E2E), Vitest (Unit)

### Backend Stack
- **Runtime**: Node.js 22+ (LTS)
- **Framework**: Fastify
- **Database**: MongoDB Atlas with Mongoose
- **Validation**: Zod schemas
- **Authentication**: JWT + Google OAuth 2.0
- **Password Hashing**: bcrypt
- **Testing**: Vitest (Unit), Jest (Integration)
- **Monitoring**: Custom performance monitoring
- **API**: RESTful APIs with comprehensive endpoints

### Infrastructure
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render
- **Database**: MongoDB Atlas
- **CDN**: Vercel Edge Network
- **CI/CD**: GitHub Actions
- **Production**: Docker + Docker Compose
- **Reverse Proxy**: Nginx
- **Monitoring**: Custom performance monitoring

## Technical Decisions

### 1. TypeScript First
**Decision**: Use TypeScript for both frontend and backend
**Rationale**: Type safety, better DX, maintainability
**Trade-offs**:
- ✅ Reduced runtime errors
- ✅ Better IDE support
- ❌ Additional compilation step
- ❌ Learning curve

### 2. Full-Stack Separation
**Decision**: Separate frontend and backend repositories
**Rationale**: Independent scaling, deployment flexibility

### 3. Code Quality Standards (TASK-022)
**Decision**: Implement comprehensive code quality tools and standards
**Rationale**: Maintainable codebase, consistent development practices
**Implementation**:
- ✅ **Custom ESLint Plugins**: `no-hardcoded-strings`, `no-duplicate-i18n-keys`
- ✅ **Automated Error Correction**: Scripts for systematic error fixing
- ✅ **Logger Implementation**: Replaced console.log with structured logging
- ✅ **TypeScript Configuration**: Optimized for gradual strict mode adoption
**Trade-offs**:
- ✅ Improved code consistency
- ✅ Reduced technical debt
- ✅ Better debugging capabilities
- ❌ Temporary strict mode disable for build stability
- ❌ Gradual re-enabling of strict features required
**Trade-offs**:
- ✅ Independent deployments
- ✅ Technology diversity
- ❌ CORS complexity
- ❌ Multiple deployment pipelines

### 3. MongoDB with Hybrid Modeling
**Decision**: Use MongoDB with embedding + referencing
**Rationale**: Flexibility, performance optimization
**Trade-offs**:
- ✅ Schema flexibility
- ✅ Performance for related data
- ❌ No ACID transactions across documents
- ❌ Complex queries

### 4. JWT Authentication
**Decision**: Use JWT with access/refresh token pattern
**Rationale**: Stateless, scalable, secure
**Trade-offs**:
- ✅ Stateless authentication
- ✅ Scalability
- ❌ Token revocation complexity
- ❌ Token size limitations

### 5. Zustand for State Management
**Decision**: Use Zustand instead of Redux
**Rationale**: Simplicity, TypeScript support, performance
**Trade-offs**:
- ✅ Minimal boilerplate
- ✅ Great TypeScript support
- ❌ Smaller community than Redux
- ❌ Less ecosystem

## Technical Constraints

### 1. Browser Support
- **Minimum**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **PWA Support**: Required for mobile experience
- **JavaScript**: ES2020+ features

### 2. Performance Requirements
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **API Response Time**: < 300ms (p95)

### 3. Security Requirements
- **HTTPS**: Mandatory for all communications
- **CORS**: Strict origin validation
- **Input Validation**: All inputs validated with Zod
- **Password Security**: bcrypt with salt rounds 10+

### 4. Scalability Constraints
- **Concurrent Users**: 1000+ simultaneous users
- **Data Volume**: 1M+ transactions per space
- **Storage**: MongoDB Atlas free tier limits
- **Bandwidth**: Vercel/Render free tier limits

## Development Environment

### 1. Local Development
- **Node.js**: 22+ LTS
- **Package Manager**: npm
- **IDE**: VS Code with TypeScript support
- **Git**: Version control with conventional commits

### 2. Code Quality
- **Linting**: ESLint with Airbnb config
- **Formatting**: Prettier
- **Type Checking**: TypeScript strict mode
- **Testing**: Vitest for unit/integration tests

### 3. Build Process
- **Frontend**: Vite build with code splitting
- **Backend**: TypeScript compilation
- **Assets**: SCSS compilation, image optimization
- **PWA**: Service worker generation

## Integration Points

### 1. Google OAuth 2.0
- **Provider**: Google Identity Platform
- **Scopes**: email, profile
- **Flow**: Authorization Code with PKCE
- **Token Handling**: JWT validation

### 2. MongoDB Atlas
- **Connection**: MongoDB Driver
- **Authentication**: Database user credentials
- **Security**: IP whitelist, SSL/TLS
- **Backup**: Automated daily backups

### 3. Vercel Integration
- **Deployment**: Git-based automatic deployment
- **Environment**: Production/staging environments
- **Domain**: Custom domain configuration
- **Analytics**: Vercel Analytics integration

### 4. Render Integration
- **Deployment**: Git-based automatic deployment
- **Environment**: Production environment
- **Database**: MongoDB Atlas connection
- **Monitoring**: Render monitoring dashboard

## Security Considerations

### 1. Data Protection
- **Encryption**: TLS 1.3 for data in transit
- **Storage**: MongoDB Atlas encryption at rest
- **Sensitive Data**: Never stored in plain text
- **API Keys**: Environment variables only

### 2. Authentication Security
- **Password Hashing**: bcrypt with salt rounds 10
- **JWT Security**: Short-lived access tokens
- **Refresh Tokens**: Secure storage, rotation
- **OAuth Security**: PKCE, state parameter validation

### 3. API Security
- **Rate Limiting**: 100 requests/minute per IP
- **CORS**: Strict origin validation
- **Input Validation**: Zod schema validation
- **Error Handling**: No sensitive data in errors

## Performance Optimizations

### 1. Frontend Optimizations
- **Code Splitting**: Route-based and component-based
- **Lazy Loading**: Images and non-critical components
- **Caching**: Service Worker cache strategy
- **Bundle Size**: Tree shaking, dynamic imports

### 2. Backend Optimizations
- **Database Indexing**: Optimized queries
- **Connection Pooling**: MongoDB connection management
- **Caching**: In-memory caching for frequent data
- **Compression**: Gzip compression for responses

### 3. Database Optimizations
- **Indexes**: Compound indexes for common queries
- **Aggregation**: MongoDB aggregation pipeline
- **Pagination**: Cursor-based pagination
- **Projection**: Return only required fields

## Monitoring and Logging

### 1. Application Monitoring
- **Frontend**: Vercel Analytics
- **Backend**: Render monitoring
- **Database**: MongoDB Atlas monitoring
- **Errors**: Centralized error tracking

### 2. Logging Strategy
- **Levels**: ERROR, WARN, INFO, DEBUG
- **Format**: Structured JSON logs
- **Retention**: 30 days for production
- **Sensitive Data**: Never logged

### 3. Health Checks
- **Frontend**: Service worker status
- **Backend**: Database connectivity, memory usage
- **Database**: Connection status, query performance
- **External**: Google OAuth availability

## Deployment Strategy

### 1. Environment Management
- **Development**: Local development with hot reload
- **Staging**: Vercel preview deployments
- **Production**: Vercel production + Render production

### 2. CI/CD Pipeline
- **Trigger**: Push to main branch
- **Frontend**: Build → Test → Deploy to Vercel
- **Backend**: Build → Test → Deploy to Render
- **Database**: Migration scripts (if needed)

### 3. Rollback Strategy
- **Frontend**: Vercel instant rollback
- **Backend**: Render rollback to previous version
- **Database**: MongoDB Atlas point-in-time recovery

## Future Technical Considerations

### 1. Scalability Improvements
- **CDN**: Global content delivery
- **Caching**: Redis for session management
- **Load Balancing**: Multiple backend instances
- **Database Sharding**: Horizontal scaling

### 2. Feature Additions
- **Real-time**: WebSocket integration
- **Mobile**: React Native or PWA enhancement
- **Analytics**: Advanced user analytics
- **AI/ML**: Intelligent insights and predictions

### 3. Technology Evolution
- **React**: Keep up with latest versions
- **Node.js**: Regular LTS updates
- **MongoDB**: New features and optimizations
- **Security**: Regular security updates
