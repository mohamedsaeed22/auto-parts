# Error Messages Translation Guide

This document lists all standardized error messages available in both Arabic and English across the application.

## 🔄 Consistent Error Messages

All components now use the same translation keys for consistent messaging:

### General Data States

| Translation Key | English             | Arabic                    |
| --------------- | ------------------- | ------------------------- |
| `noData`        | "No data available" | "لا توجد بيانات متاحة"    |
| `noResults`     | "No results found"  | "لم يتم العثور على نتائج" |

### Product Related

| Translation Key       | English                                                                                      | Arabic                                                                       |
| --------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `noProducts`          | "No products found"                                                                          | "لم يتم العثور على منتجات"                                                   |
| `noProductsFound`     | "No products found"                                                                          | "لم يتم العثور على منتجات"                                                   |
| `noProductsFoundDesc` | "No products are available at the moment."                                                   | "لا توجد منتجات متاحة في الوقت الحالي."                                      |
| `noProductsAvailable` | "No products are currently available. Please check back later or contact us for assistance." | "لا توجد منتجات متاحة حالياً. يرجى المحاولة لاحقاً أو الاتصال بنا للمساعدة." |
| `productNotFound`     | "Product not found"                                                                          | "المنتج غير موجود"                                                           |

### Brand Related

| Translation Key     | English                                            | Arabic                                                 |
| ------------------- | -------------------------------------------------- | ------------------------------------------------------ |
| `noBrands`          | "No brands available"                              | "لا توجد علامات تجارية متاحة"                          |
| `noBrandsFound`     | "No brands found"                                  | "لم يتم العثور على علامات تجارية"                      |
| `noBrandsFoundDesc` | "No brands are available at the moment."           | "لا توجد علامات تجارية متاحة في الوقت الحالي."         |
| `brandNotFound`     | "Brand not found"                                  | "العلامة التجارية غير موجودة"                          |
| `noProductsYet`     | "No products available yet"                        | "لا توجد منتجات متاحة بعد"                             |
| `noProductsYetDesc` | "Products from this brand will be available soon." | "المنتجات من هذه العلامة التجارية ستكون متاحة قريباً." |

### Category Related

| Translation Key         | English                                      | Arabic                                |
| ----------------------- | -------------------------------------------- | ------------------------------------- |
| `noCategories`          | "No categories available"                    | "لا توجد فئات متاحة"                  |
| `noCategoriesFound`     | "No categories found"                        | "لم يتم العثور على فئات"              |
| `noCategoriesFoundDesc` | "No categories are available at the moment." | "لا توجد فئات متاحة في الوقت الحالي." |
| `categoryNotFound`      | "Category not found"                         | "الفئة غير موجودة"                    |
| `noSubcategories`       | "No subcategories available"                 | "لا توجد فئات فرعية متاحة"            |

### Offers Related

| Translation Key     | English                                  | Arabic                                |
| ------------------- | ---------------------------------------- | ------------------------------------- |
| `noOffers`          | "No offers available"                    | "لا توجد عروض متاحة"                  |
| `noOffersFound`     | "No offers found"                        | "لم يتم العثور على عروض"              |
| `noOffersFoundDesc` | "No offers are available at the moment." | "لا توجد عروض متاحة في الوقت الحالي." |
| `offerNotFound`     | "Offer not found"                        | "العرض غير موجود"                     |

### Banner/Hero Related

| Translation Key      | English                                   | Arabic                                         |
| -------------------- | ----------------------------------------- | ---------------------------------------------- |
| `noBanners`          | "No banners available"                    | "لا توجد لوحات إعلانية متاحة"                  |
| `noBannersFound`     | "No banners found"                        | "لم يتم العثور على لوحات إعلانية"              |
| `noBannersFoundDesc` | "No banners are available at the moment." | "لا توجد لوحات إعلانية متاحة في الوقت الحالي." |

### Other Content

| Translation Key | English                 | Arabic                 |
| --------------- | ----------------------- | ---------------------- |
| `noPartners`    | "No partners available" | "لا يوجد شركاء متاحون" |
| `noContent`     | "No content available"  | "لا يوجد محتوى متاح"   |

## 🔧 Usage in Components

### Example 1: Product Listing

```tsx
import { useTranslation } from "react-i18next";

const ProductList = () => {
  const { t } = useTranslation("common"); // or "products"

  if (products.length === 0) {
    return (
      <div>
        <h3>{t("noProductsFound")}</h3>
        <p>{t("noProductsFoundDesc")}</p>
      </div>
    );
  }
};
```

### Example 2: Brand Listing

```tsx
import { useTranslation } from "react-i18next";

const BrandList = () => {
  const { t } = useTranslation("brands");

  if (brands.length === 0) {
    return (
      <div>
        <h3>{t("noBrandsFound")}</h3>
        <p>{t("noBrandsFoundDesc")}</p>
      </div>
    );
  }
};
```

### Example 3: Common Messages

```tsx
import { useTranslation } from "react-i18next";

const Component = () => {
  const { t } = useTranslation("common");

  if (error) {
    return <div>{t("noData")}</div>;
  }
};
```

## 📂 Translation Files Location

- English: `src/lib/i18n/transalations/en/`
- Arabic: `src/lib/i18n/transalations/ar/`

### Files with error messages:

- `common.json` - General error states
- `products.json` - Product-specific messages
- `brands.json` - Brand-specific messages
- `categories.json` - Category-specific messages
- `offers.json` - Offer-specific messages

## ✅ Updated Components

The following components have been updated to use consistent translations:

1. **HeroSwiper** - Uses `noBannersFound` and `noBannersFoundDesc` from common
2. **Products Page** - Uses `noProductsFound` and `noProductsFoundDesc` from products
3. **Brands Component** - Uses `noBrandsFound` and `noBrandsFoundDesc` from brands
4. **SearchAutocomplete** - Fixed null category error and uses consistent messages

## 🎯 Best Practices

1. **Always use translation keys** instead of hardcoded strings
2. **Use consistent naming** - Follow the pattern: `no[Entity]Found` and `no[Entity]FoundDesc`
3. **Provide fallbacks** - Always include fallback text: `{t("key") || "Fallback"}`
4. **Use appropriate namespace** - Use component-specific namespace when available, fall back to "common"
5. **Test both languages** - Ensure messages display correctly in Arabic and English

## 🔄 Adding New Error Messages

When adding new error messages:

1. Add to both English and Arabic translation files
2. Follow the naming convention: `no[Entity]Found` / `no[Entity]FoundDesc`
3. Use appropriate namespace (common, products, brands, etc.)
4. Update this documentation
5. Test in both RTL and LTR layouts

This ensures consistent user experience across all components and languages!
