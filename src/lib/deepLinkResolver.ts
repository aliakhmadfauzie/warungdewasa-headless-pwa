export type MarketplacePlatform = 'shopee' | 'tokopedia';

export interface DeepLinkConfig {
  platform: MarketplacePlatform;
  webUrl: string;
  nativeSchemeUrl?: string;
}

/**
 * Intelligent Deep Link Trigger with Native App Attempt and Web URL Fallback
 */
export const openRegionalMarketplace = (config: DeepLinkConfig) => {
  const { platform, webUrl } = config;

  if (!webUrl) {
    alert(`Link ${platform.toUpperCase()} belum dikonfigurasi untuk produk ini.`);
    return;
  }

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (!isMobile) {
    // Desktop: Direct to Web URL
    window.open(webUrl, '_blank', 'noopener,noreferrer');
    return;
  }

  // Mobile Deep Link construction
  let nativeUrl = config.nativeSchemeUrl;
  if (!nativeUrl) {
    if (platform === 'shopee') {
      // Shopee app scheme standard pattern
      nativeUrl = webUrl.replace(/^https?:\/\/shopee\.co\.id\//, 'shopee://');
    } else if (platform === 'tokopedia') {
      // Tokopedia app scheme standard pattern
      nativeUrl = webUrl.replace(/^https?:\/\/tokopedia\.com\//, 'tokopedia://');
    }
  }

  const start = Date.now();
  if (nativeUrl) {
    window.location.href = nativeUrl;
  }

  // Fallback to web URL if app fails to launch within 800ms
  setTimeout(() => {
    if (Date.now() - start < 1500) {
      window.open(webUrl, '_blank', 'noopener,noreferrer');
    }
  }, 800);
};
