# SEO Testing Guide - Quick Validation

## 1. Visual Inspection (2 minutes)

### View Page Source

1. Open your website in browser
2. Right-click → View Page Source (Ctrl+U)
3. Search for these key elements:

```html
<!-- Should see your business info -->
<meta name="geo.placename" content="Jeddah, Saudi Arabia" />
<meta name="business:contact_data:phone_number" content="+966543777569" />
<meta name="business:contact_data:email" content="parts@falfuture.com" />

<!-- Should see proper descriptions -->
<meta name="description" content="...Fal Al-Gharbia..." />

<!-- Should see Open Graph tags -->
<meta property="og:title" content="..." />
<meta property="og:image" content=".../og-image.jpg" />
<meta property="og:locale" content="ar_SA" />

<!-- Should see structured data -->
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "AutomotivePartsStore",
    "telephone": "+966543777569"
    ...
  }
</script>
```

## 2. Online Validators (10 minutes)

### A. Facebook Debugger

**URL**: https://developers.facebook.com/tools/debug/

1. Enter your website URL: `https://www.falfuture.com`
2. Click "Debug"
3. **Should see**:

   - ✅ Title: "فال بارتس - قطع غيار السيارات..."
   - ✅ Description with your business info
   - ✅ Image: og-image.jpg (1200x630)
   - ✅ Type: website
   - ✅ URL: correct canonical URL

4. **If issues**: Click "Scrape Again"

### B. Twitter Card Validator

**URL**: https://cards-dev.twitter.com/validator

1. Enter your URL
2. Click "Preview Card"
3. **Should see**:
   - ✅ Large image card
   - ✅ Correct title and description
   - ✅ Your og-image.jpg displayed

### C. Google Rich Results Test

**URL**: https://search.google.com/test/rich-results

1. Enter your URL or paste HTML
2. Click "Test URL"
3. **Should see**:
   - ✅ "Page is eligible for rich results"
   - ✅ AutomotivePartsStore schema detected
   - ✅ Organization schema detected
   - ✅ FAQPage schema detected
   - ✅ No errors or warnings

**Check specific schemas**:

- LocalBusiness/AutomotivePartsStore
- Organization
- FAQ (6 questions)
- BreadcrumbList

### D. Schema.org Validator

**URL**: https://validator.schema.org/

1. Paste your page HTML
2. Click "Run Test"
3. **Should see**: No errors
4. Review detected schemas

## 3. Mobile Testing (5 minutes)

### Google Mobile-Friendly Test

**URL**: https://search.google.com/test/mobile-friendly

1. Enter your URL
2. **Should see**:
   - ✅ "Page is mobile friendly"
   - ✅ Screenshot of mobile view
   - ✅ No mobile usability issues

## 4. Performance Testing (5 minutes)

### PageSpeed Insights

**URL**: https://pagespeed.web.dev/

1. Enter your URL
2. Test both Mobile and Desktop
3. **Target scores**:
   - Performance: 90+
   - Accessibility: 95+
   - Best Practices: 95+
   - SEO: 100

**Common SEO checks**:

- ✅ Document has a meta description
- ✅ Links have descriptive text
- ✅ Document has a valid `<title>`
- ✅ `[hreflang]` tags are valid
- ✅ Image elements have `[alt]` attributes

## 5. SEO Audit Tools (Optional - 10 minutes)

### A. Screaming Frog (Desktop App)

1. Download and install Screaming Frog SEO Spider
2. Enter your website URL
3. Check:
   - All pages have unique titles
   - All pages have unique descriptions
   - No broken links
   - All images have alt text
   - Canonical URLs are correct

### B. SEMrush Site Audit (Free Trial)

1. Sign up at semrush.com
2. Run site audit
3. Review:
   - Technical SEO issues
   - On-page SEO recommendations
   - Mobile usability
   - Performance metrics

## 6. Structured Data Specific Tests

### Test LocalBusiness Schema

Look for these in your structured data:

```json
{
  "@type": "AutomotivePartsStore",
  "name": "FalParts",
  "telephone": "+966543777569",
  "address": {
    "streetAddress": "Prince Mohammed Bin Abdulaziz St",
    "addressLocality": "Jeddah",
    "postalCode": "23441"
  },
  "geo": {
    "latitude": "21.5433",
    "longitude": "39.1728"
  }
}
```

### Test FAQ Schema

Should have 6 FAQ items about:

1. Types of parts
2. Free shipping
3. Delivery times
4. Genuine parts
5. Location
6. Business hours

## 7. Quick Checklist

Before going live, verify:

### Images

- [ ] `/public/og-image.jpg` exists (1200x630px)
- [ ] `/public/logo.png` exists
- [ ] `/public/favicon.ico` exists
- [ ] All images have proper dimensions

### Meta Tags (View Source)

- [ ] Title tag present and unique
- [ ] Meta description present (150-160 chars)
- [ ] Canonical URL correct
- [ ] Hreflang tags for ar/en
- [ ] Open Graph tags complete
- [ ] Twitter Card tags complete
- [ ] Geo-location tags with Jeddah coordinates
- [ ] Business contact meta tags

### Structured Data

- [ ] Organization schema
- [ ] LocalBusiness/AutomotivePartsStore schema
- [ ] FAQ schema (6 questions)
- [ ] Website schema with SearchAction
- [ ] No validation errors

### Content

- [ ] Business phone: 0543777569
- [ ] Email: parts@falfuture.com
- [ ] Address: Jeddah, Saudi Arabia
- [ ] Business hours: Sat-Thu 9AM-9PM

### Technical

- [ ] Site loads in under 3 seconds
- [ ] Mobile responsive
- [ ] HTTPS enabled
- [ ] No console errors
- [ ] No broken links

## 8. Post-Launch Monitoring

### Week 1:

- [ ] Submit to Google Search Console
- [ ] Submit to Bing Webmaster Tools
- [ ] Request indexing for key pages
- [ ] Monitor crawl errors

### Week 2-4:

- [ ] Check search impressions
- [ ] Monitor ranking for key terms
- [ ] Review click-through rates
- [ ] Fix any issues reported

### Monthly:

- [ ] Review Google Analytics data
- [ ] Check Core Web Vitals
- [ ] Monitor mobile usability
- [ ] Update content as needed

## 9. Common Issues & Fixes

### Issue: OG Image Not Showing

**Fix**:

- Ensure image is exactly 1200x630px
- Use JPG format (not PNG)
- Check image file size (< 8MB)
- Clear cache and re-scrape in Facebook Debugger

### Issue: Structured Data Errors

**Fix**:

- Validate with Google Rich Results Test
- Check for missing required fields
- Ensure proper JSON-LD syntax
- Use Schema.org validator

### Issue: Low Mobile Score

**Fix**:

- Optimize images
- Enable compression
- Minimize CSS/JS
- Use lazy loading

### Issue: Hreflang Errors

**Fix**:

- Ensure bidirectional links (ar ↔ en)
- Use correct locale codes (ar_SA, en_US)
- Include x-default for fallback

## 10. Success Metrics

After 1 month, you should see:

- ✅ Indexed pages in Google (check: `site:falfuture.com`)
- ✅ Rich results in search (business info, FAQs)
- ✅ Improved organic traffic
- ✅ Better click-through rates
- ✅ Local pack presence (Google Maps)

---

## Quick Command Reference

### View Sitemap

```
https://www.falfuture.com/sitemap.xml
```

### Test Robots.txt

```
https://www.falfuture.com/robots.txt
```

### Check Indexing

```
site:falfuture.com
```

### Check Specific Page

```
site:falfuture.com/about
```

---

**Remember**: SEO is an ongoing process. These tests should be run:

- ✅ Before launch (mandatory)
- ✅ After major updates
- ✅ Monthly for monitoring
- ✅ When issues are reported

Good luck with your launch! 🚀
