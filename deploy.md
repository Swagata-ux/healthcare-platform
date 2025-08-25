# Healthcare Platform Deployment Guide

## 1. Frontend (Vercel)

```bash
cd web-frontend
npm run build
vercel --prod
```

Set environment variables in Vercel dashboard:
- `REACT_APP_API_URL=https://your-api.railway.app`

## 2. Backend (Railway)

```bash
cd services/api-gateway
railway init
railway up
```

Set environment variables in Railway:
- `DATABASE_URL` (auto-provided)
- `JWT_SECRET=your-production-secret`
- `NODE_ENV=production`

## 3. Database Setup

Run migrations on production:
```bash
railway run npx prisma migrate deploy
railway run npx prisma db seed
```

## 4. Update CORS

Update main.ts with production URLs:
```typescript
app.enableCors({
  origin: ['https://your-frontend.vercel.app'],
  credentials: true,
});
```

## 5. Mobile App (Expo)

```bash
cd app-mobile
npx eas build --platform all
```

Update API URL in app.json:
```json
{
  "expo": {
    "extra": {
      "apiUrl": "https://your-api.railway.app"
    }
  }
}
```

## Cost Breakdown (FREE)

- **Frontend**: Vercel Free (Unlimited)
- **Backend**: Railway $5 credit/month (Free for small apps)
- **Database**: Supabase Free (500MB)
- **Mobile**: Expo EAS Free (30 builds/month)
- **Domain**: Vercel/Railway subdomains (Free)

Total: **$0/month** for development and small-scale production!