# Envision Production Group Website

Professional equipment rental website built with Next.js and Strapi CMS.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 20+ (for local development)

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd envision-site
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Copy frontend environment template
cp frontend/.env.example frontend/.env.local

# Generate secure keys
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
node -e "console.log('ADMIN_JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
node -e "console.log('APP_KEYS=' + Array(4).fill(0).map(() => require('crypto').randomBytes(32).toString('base64')).join(','))"

# Update .env with generated keys and your database password
```

### 3. Start Development Environment
```bash
# Set user permissions
export UID=$(id -u) && export GID=$(id -g)

# Start all services
docker compose up -d

# View logs
docker compose logs -f
```

### 4. Initial Setup
1. Access Strapi admin: `http://your-server:1337/admin`
2. Create admin account
3. Set up content types (Equipment Category, Equipment Item)
4. Configure API permissions: Settings → Roles → Public
5. Add sample content

### 5. Access Points
- **Frontend**: `http://your-server:3000`
- **Strapi Admin**: `http://your-server:1337/admin`
- **API**: `http://your-server:1337/equipment-categories`

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js       │    │     Strapi      │    │   PostgreSQL    │
│   Frontend      │◄──►│      CMS        │◄──►│    Database     │
│   Port 3000     │    │   Port 1337     │    │   Port 5432     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ▲                       ▲                       ▲
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │     Caddy       │
                    │ Reverse Proxy   │
                    │   Port 80/443   │
                    └─────────────────┘
```

## 🛠️ Development

### File Structure
```
envision-site/
├── docker-compose.yml          # Container orchestration
├── .env.example               # Environment template
├── frontend/                  # Next.js application
│   ├── src/
│   │   ├── app/              # Pages (App Router)
│   │   └── lib/              # Utilities & config
│   ├── .env.example          # Frontend environment template
│   └── Dockerfile.dev        # Development container
├── strapi-app/               # Strapi CMS (auto-generated)
└── README.md                 # This file
```

### Hot Reloading
The development setup includes hot reloading:
- Edit files in `frontend/src/`
- Changes appear immediately in browser
- No need to restart containers

### Adding New Pages
```bash
# Create new page
mkdir -p frontend/src/app/new-page
echo 'export default function NewPage() { return <div>New Page</div> }' > frontend/src/app/new-page/page.tsx

# Available at: http://your-server:3000/new-page
```

## 🚀 Production Deployment

### 1. Update Environment Variables
```bash
# In .env file:
NODE_ENV=production
DOMAIN=your-production-domain.com
NEXT_PUBLIC_STRAPI_URL=https://your-production-domain.com
```

### 2. Caddy Configuration
Add to your Caddyfile:
```caddyfile
your-domain.com {
    reverse_proxy 192.168.0.41:3000
    
    handle /admin* {
        reverse_proxy 192.168.0.41:1337
    }
    
    handle /equipment* {
        reverse_proxy 192.168.0.41:1337
    }
    
    handle /uploads* {
        reverse_proxy 192.168.0.41:1337
    }
}
```

### 3. Deploy
```bash
docker compose down
docker compose up -d --build
```

## 🔧 Useful Commands

### Development
```bash
# View all container logs
docker compose logs

# View specific service logs
docker compose logs frontend
docker compose logs strapi

# Restart specific service
docker compose restart frontend

# Rebuild after changes
docker compose up --build -d

# Stop all services
docker compose down
```

### Database
```bash
# Backup database
docker compose exec postgres pg_dump -U strapi_user envision_db > backup.sql

# Restore database
docker compose exec -T postgres psql -U strapi_user envision_db < backup.sql
```

### Troubleshooting
```bash
# Check container status
docker compose ps

# Access container shell
docker compose exec frontend sh
docker compose exec strapi sh

# Check network connectivity
docker compose exec frontend ping strapi
```

## 📝 Content Management

### Adding Equipment
1. Go to Strapi admin (`/admin`)
2. Content Manager → Equipment Item → Create new entry
3. Fill required fields: name, sku, dailyRate, quantity, availableQuantity
4. Set category and upload images
5. **Important**: Click "Publish" (not just Save)

### Equipment Categories
Create categories first:
- Lighting
- Audio  
- Video
- Power & Distribution
- Staging
- Effects

## 🔒 Security Notes

- Never commit `.env` files
- Regularly update dependencies
- Use strong passwords for database
- Keep Strapi admin credentials secure
- Regular backups of database and uploads

## 🎨 Customization

### Brand Colors
Edit `frontend/src/lib/config.ts`:
```typescript
branding: {
  colors: {
    primary: { 500: "#your-color" }
  }
}
```

### Logo
Add logo files to `frontend/public/images/`:
- `logo.png` - Main logo
- `logo-light.png` - For dark backgrounds
- `hero-bg.jpg` - Hero background image

## 📞 Support

For issues or questions:
- Check logs: `docker compose logs`
- Review this README
- Check GitHub issues