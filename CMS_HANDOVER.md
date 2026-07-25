# Aspire Gems CMS handover

## Ownership rule
The Sanity account, project, dataset, hosting account, domain and business contact details must belong to Aspire Gems/the friend. No developer particulars are required.

## One-time owner action
1. Sign in to Sanity using the owner's email.
2. Create a project named `Aspire Gems`.
3. Keep the dataset name as `production`.
4. Copy the Project ID.
5. Add the developer temporarily as a project administrator only if required.

## Connect the prepared Studio
Inside `cms/`:

```bash
copy .env.example .env
```

Replace the placeholder in `.env`, then run:

```bash
npm install
npm run dev
```

The Studio schemas already support site settings, editable pages, categories, catalogue filters, products, image uploads, video URLs and SEO fields.

## Final handover
Transfer the GitHub repository to the owner's account, deploy the public site from the owner's Cloudflare account, connect the owner's domain, confirm the owner has full CMS access, then remove temporary developer access.
