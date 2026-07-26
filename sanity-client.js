(() => {
  const config = window.ASPIRE_SANITY_CONFIG || {};
  const hasProject = Boolean(config.projectId && !String(config.projectId).includes('REPLACE'));
  const slug = value => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  function normalize(payload) {
    const fallback = structuredClone(window.ASPIRE_DEFAULT_CONTENT);
    if (!payload) return fallback;

    const settings = payload.settings || {};
    fallback.brand.name = settings.brandName || fallback.brand.name;
    fallback.brand.tagline = settings.tagline || fallback.brand.tagline;
    fallback.brand.email = settings.email || fallback.brand.email;
    fallback.brand.phone = settings.phone || fallback.brand.phone;
    fallback.brand.location = settings.location || fallback.brand.location;
    if (Array.isArray(settings.navigation) && settings.navigation.length) fallback.navigation = settings.navigation;

    if (Array.isArray(payload.categories) && payload.categories.length) {
      fallback.categories = payload.categories.map((item, index) => {
        const key = `cms-category-${item._id || index}`;
        if (item.imageUrl) window.ASPIRE_MEDIA[key] = item.imageUrl;
        return {
          id: item.slug?.current || slug(item.name),
          name: item.name,
          image: item.imageUrl ? key : fallback.categories[index % fallback.categories.length]?.image,
        };
      });
    }

    if (Array.isArray(payload.filters) && payload.filters.length) {
      fallback.filterGroups = payload.filters.map((item, index) => ({
        id: item.key || slug(item.label) || `filter-${index + 1}`,
        label: item.label,
        options: Array.isArray(item.options) ? item.options : [],
      }));
    }

    if (Array.isArray(payload.products) && payload.products.length) {
      fallback.products = payload.products.map((item, index) => {
        const gallery = Array.isArray(item.imageUrls) ? item.imageUrls.filter(Boolean) : [];
        const imageKeys = gallery.map((url, imageIndex) => {
          const key = `cms-product-${item._id || index}-${imageIndex}`;
          window.ASPIRE_MEDIA[key] = url;
          return key;
        });
        const fallbackImage = fallback.products[index % fallback.products.length]?.image;
        return {
          id: item.slug?.current || slug(item.name) || `product-${index + 1}`,
          name: item.name,
          description: item.description || '',
          image: imageKeys[0] || fallbackImage,
          images: imageKeys.length ? imageKeys : [fallbackImage].filter(Boolean),
          category: item.categoryName || '',
          collection: item.collection || '',
          gem: item.gemstone || '',
          color: item.colour || '',
          shape: item.shape || '',
          origin: item.origin || '',
          metal: item.metal || '',
          carat: Number(item.carat || 0),
          availability: item.availability || 'Available',
          featured: Boolean(item.featured),
          offer: item.offerLabel || '',
          certification: item.certification || '',
        };
      });
    }

    return fallback;
  }

  window.AspireCms = {
    mode: hasProject ? 'sanity' : 'local-fallback',
    async load() {
      if (!hasProject) return structuredClone(window.ASPIRE_DEFAULT_CONTENT);
      const query = `{
        "settings": *[_type == "siteSettings"][0],
        "categories": *[_type == "category" && visible != false] | order(order asc){_id,name,slug,"imageUrl":image.asset->url},
        "filters": *[_type == "filterGroup" && visible != false] | order(order asc){_id,label,key,options},
        "products": *[_type == "product"] | order(featured desc, name asc){_id,name,slug,description,collection,gemstone,colour,shape,origin,metal,carat,availability,featured,offerLabel,certification,"categoryName":category->name,"imageUrls":images[].asset->url}
      }`;
      const apiVersion = config.apiVersion || '2026-07-01';
      const dataset = config.dataset || 'production';
      const url = `https://${config.projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(query)}`;
      try {
        const response = await fetch(url, {credentials: 'omit'});
        if (!response.ok) throw new Error(`CMS request failed: ${response.status}`);
        const payload = await response.json();
        return normalize(payload.result);
      } catch (error) {
        console.warn('Using local fallback content.', error);
        return structuredClone(window.ASPIRE_DEFAULT_CONTENT);
      }
    },
  };
})();