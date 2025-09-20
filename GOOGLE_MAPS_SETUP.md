# Google Maps Setup Guide

## 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:

   - **Maps JavaScript API** (for map display)
   - **Places API** (for search autocomplete)
   - **Geocoding API** (for address conversion)

4. Go to **APIs & Services** → **Credentials**
5. Click **Create Credentials** → **API Key**
6. Copy your API key

## 2. Configure Environment Variables

Create or update your `.env.local` file in the project root:

```bash
# Google Maps Configuration
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

## 3. API Restrictions (Recommended)

For security, restrict your API key:

1. In Google Cloud Console, click on your API key
2. Under **Application restrictions**:

   - Select "HTTP referrers (web sites)"
   - Add: `localhost:3000/*`, `your-domain.com/*`

3. Under **API restrictions**:
   - Select "Restrict key"
   - Enable: Maps JavaScript API, Places API, Geocoding API

## 4. Pricing Information

- **Maps JavaScript API**: Free up to 28,000 map loads/month
- **Places API**: Free up to 17,000 requests/month
- **Geocoding API**: Free up to 40,000 requests/month

## 5. Test Your Setup

1. Restart your development server: `npm run dev`
2. Navigate to the registration page
3. The location picker should load without errors
4. You should be able to:
   - See the map
   - Search for addresses
   - Click to select locations
   - Use current location

## 6. Troubleshooting

**"API key not configured" error:**

- Check your `.env.local` file exists
- Verify the API key is correct
- Restart the development server

**"This API project is not authorized" error:**

- Enable the required APIs in Google Cloud Console
- Wait 5-10 minutes for changes to propagate

**Map not loading:**

- Check browser console for errors
- Verify API key restrictions allow your domain
- Check your internet connection
