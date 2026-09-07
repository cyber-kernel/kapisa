# KAPISA Shopify Theme

Kapisa is a native Shopify Online Store 2.0 theme built around the same principles that make Shopify Dawn a strong foundation: semantic HTML, CSS-first presentation, JavaScript only where needed, section-based customization, responsive imagery, and Shopify-native commerce primitives. The visual system uses Kapisa's healthcare identity: deep navy, warm gold accents, and soft cream surfaces rather than a generic purple palette.

## Upload
1. Shopify Admin → Online Store → Themes.
2. Add theme → Upload zip file.
3. Upload the KAPISA-SHOPIFY-THEME.zip file.
4. Open Customize.

## Launch catalog
Create:
- All Scrubs
- Men's Scrubs
- Women's Scrubs

Use product variants for Baby Pink, Midnight Navy, Deep Wine and Desert Sand rather than separate color collections at launch.

## Homepage
Announcement bar → Header/Mega Menu → Hero → Shop Your Fit → Featured Products → Color Story → Editorial → Why Kapisa → Essentials → Shoppable Video Gallery → Testimonials → Social Gallery → Newsletter → Footer.

Every homepage component is an independent OS 2.0 section and can be reordered/edited in Theme Customizer.

## Mega menu
The header reads Shopify's nested menu hierarchy dynamically. Parent menu items with children become desktop mega-menu columns and mobile accordions. In the Header section settings, switch between Mega menu and Normal menu. Add future color/category links through Shopify Navigation, and optionally add collection feature blocks with images from the Header editor.

## Shoppable video gallery
The homepage includes an optional Shoppable video gallery section. Add up to 12 Shopify-hosted videos or MP4 URLs, poster images, and products from the Theme Customizer. Clicking a card opens a responsive modal with video sound controls, variant selection, and AJAX Add to cart without leaving the modal.

## Important before publishing
Replace placeholder imagery/copy and add your actual shipping, returns, product-care and legal content. Do not publish placeholder testimonials.

## Validation
Use Shopify CLI and Theme Check before production. Dawn's official repository recommends Theme Check and performance/Lighthouse validation.

## Shopify CLI from the VS Code terminal

For a copy-paste handoff, see [SHOPIFY-CLI-GUIDE.md](./SHOPIFY-CLI-GUIDE.md).

Install Node.js LTS first, then open the theme folder in VS Code. Authenticate once:

```powershell
npx shopify login --store your-store.myshopify.com
```

Validate the theme locally:

```powershell
npx shopify theme check
```

List themes and copy the ID of the theme you want to update:

```powershell
npx shopify theme list --store your-store.myshopify.com
```

Push this folder directly to an existing theme:

```powershell
npx shopify theme push --store your-store.myshopify.com --theme THEME_ID
```

For a safer preview, push as a new unpublished theme:

```powershell
npx shopify theme push --store your-store.myshopify.com --unpublished
```

Preview the current folder without pushing:

```powershell
npx shopify theme dev --store your-store.myshopify.com
```

Replace `your-store.myshopify.com` and `THEME_ID` with your store values. Keep the terminal open during `theme dev`; Shopify provides a preview URL and refreshes it as files change. Do not commit access tokens or store credentials.
