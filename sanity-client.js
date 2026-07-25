(() => {
  const config = window.ASPIRE_SANITY_CONFIG || {};
  const hasProject = Boolean(config.projectId && !String(config.projectId).includes('REPLACE'));

  window.AspireCms = {
    mode: hasProject ? 'sanity' : 'local-fallback',
    async load() {
      if (!hasProject) return window.ASPIRE_DEFAULT_CONTENT;

      const query = encodeURIComponent('*[_type == "siteSettings"][0]');
      const apiVersion = config.apiVersion || '2025-01-01';
      const dataset = config.dataset || 'production';
      const url = `https://${config.projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${query}`;

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`CMS request failed: ${response.status}`);
        const payload = await response.json();
        return payload.result || window.ASPIRE_DEFAULT_CONTENT;
      } catch (error) {
        console.warn('Using local fallback content.', error);
        return window.ASPIRE_DEFAULT_CONTENT;
      }
    },
  };
})();
