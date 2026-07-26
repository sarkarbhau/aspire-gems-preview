(() => {
  const mediaUrl = key => window.ASPIRE_MEDIA?.[key] || '';

  function mountGallery() {
    const layout = document.querySelector('.product-layout');
    const currentImage = layout?.querySelector(':scope > div:first-child > img');
    if (!layout || !currentImage || currentImage.dataset.galleryReady) return false;

    const id = new URLSearchParams(location.search).get('id');
    const products = window.AspireContent?.products || [];
    const product = products.find(item => item.id === id) || products[4] || products[0];
    const imageKeys = (Array.isArray(product?.images) && product.images.length
      ? product.images
      : [product?.image]).filter(Boolean);
    const imageUrls = imageKeys.map(mediaUrl).filter(Boolean);

    if (!imageUrls.length) return true;

    currentImage.dataset.galleryReady = 'true';
    currentImage.id = 'product-main-image';
    currentImage.classList.add('product-main-image');

    if (imageUrls.length === 1) return true;

    const thumbnails = document.createElement('div');
    thumbnails.className = 'product-thumbnails';
    thumbnails.innerHTML = imageUrls.map((url, index) => `
      <button class="product-thumb${index === 0 ? ' active' : ''}" type="button" data-gallery-src="${url}" aria-label="View image ${index + 1}">
        <img src="${url}" alt="${product?.name || 'Product'} view ${index + 1}">
      </button>`).join('');

    currentImage.parentElement.classList.add('product-gallery');
    currentImage.insertAdjacentElement('afterend', thumbnails);

    thumbnails.addEventListener('click', event => {
      const button = event.target.closest('[data-gallery-src]');
      if (!button) return;
      currentImage.src = button.dataset.gallerySrc;
      thumbnails.querySelectorAll('.product-thumb').forEach(item => item.classList.remove('active'));
      button.classList.add('active');
    });

    return true;
  }

  const observer = new MutationObserver(() => {
    if (mountGallery()) observer.disconnect();
  });

  observer.observe(document.getElementById('app'), {childList: true, subtree: true});
  mountGallery();
})();