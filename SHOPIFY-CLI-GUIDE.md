# Kapisa Shopify CLI guide

## 1. Requirements

- Install Node.js LTS.
- Open this theme folder in VS Code.
- Use a Shopify staff account with permission to manage themes.

## 2. Login

Run this in the VS Code PowerShell terminal:

```powershell
npx shopify login --store your-store.myshopify.com
```

Replace `your-store.myshopify.com` with the store domain. Never save a password or access token in the theme.

## 3. Check the theme

```powershell
npx shopify theme check
```

Fix reported Liquid, JSON, accessibility, and performance issues before publishing.

## 4. Preview locally

```powershell
npx shopify theme dev --store your-store.myshopify.com
```

Keep the terminal running. The CLI prints a preview URL and refreshes it as files change.

## 5. Find a theme ID

```powershell
npx shopify theme list --store your-store.myshopify.com
```

Copy the ID for the unpublished or live theme you want to update.

## 6. Push safely

Push as an unpublished theme first:

```powershell
npx shopify theme push --store your-store.myshopify.com --unpublished
```

When the preview is approved, push to an existing theme:

```powershell
npx shopify theme push --store your-store.myshopify.com --theme THEME_ID
```

Replace `THEME_ID` with the value from `theme list`.

## 7. Shopify Admin setup after pushing

1. Create **All Scrubs**, **Men's Scrubs**, and **Women's Scrubs** collections.
2. Put your eight products in the appropriate collections.
3. Add Baby Pink, Midnight Navy, Deep Wine, and Desert Sand as product variants.
4. In Navigation, create nested menu links for Men, Women, All Scrubs, and future color collections.
5. In Theme Customizer, choose **Mega menu** or **Normal menu**.
6. Add Header collection feature blocks if you want image-led navigation.
7. Add blocks to **Shoppable video gallery** with a poster, video, and product.
8. Set the contact page to use the `page.contact` template.
9. Configure footer menus, newsletter copy, social links, support links, and policies.
10. Test product variants, Add to Cart, cart drawer, checkout, contact form, mobile navigation, and reduced-motion behavior.

## 8. Release checklist

- Test on iPhone Safari and Android Chrome.
- Test on throttled 4G.
- Confirm hero and product images have real artwork and useful alt text.
- Confirm shipping, returns, care, privacy, terms, and refund content.
- Run `npx shopify theme check` again before publishing.
