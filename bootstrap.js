(async () => {
  try {
    if (window.AspireCms?.load) {
      window.ASPIRE_DEFAULT_CONTENT = await window.AspireCms.load();
    }
  } catch (error) {
    console.warn('CMS bootstrap failed; continuing with local fallback.', error);
  }
  const script = document.createElement('script');
  script.src = 'site.js';
  script.defer = true;
  document.body.appendChild(script);
})();
