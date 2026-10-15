(() => {
  'use strict';

  const tag = document.getElementById('site-analytics');
  if (!tag || window.tinyMomentsAnalyticsInitialized) return;

  const measurementId = tag.dataset.measurementId;
  const hostname = tag.dataset.hostname;
  if (hostname !== 'tinymoments.site' || location.hostname !== hostname ||
      location.protocol !== 'https:' || !/^G-[A-Z0-9]{10}$/.test(measurementId)) return;

  const appStoreUrl = 'https://apps.apple.com/kr/app/id6763057739';
  if (tag.dataset.appStoreUrl !== appStoreUrl) return;

  const panel = document.getElementById('analytics-consent');
  const settings = document.getElementById('analytics-settings');
  if (!panel || !settings) return;
  window.tinyMomentsAnalyticsInitialized = true;

  const consentKey = 'tinymoments.analytics-consent.v1';
  const disableKey = `ga-disable-${measurementId}`;
  const debug = new URLSearchParams(location.search).get('analytics_debug') === '1';
  let consent;
  let started = false;
  try {
    consent = localStorage.getItem(consentKey);
    // Reuse acceptance only while the browser still allows changing that choice.
    if (consent === 'granted') localStorage.setItem(consentKey, consent);
  } catch (_) { consent = undefined; }

  function showPanel(show) {
    panel.hidden = !show;
    settings.setAttribute('aria-expanded', String(show));
  }

  function startAnalytics() {
    if (started) return;
    started = true;
    window[disableKey] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };

    let referrer = '';
    try {
      const url = new URL(document.referrer);
      if (url.protocol === 'https:' || url.protocol === 'http:') referrer = `${url.origin}/`;
    } catch (_) { /* Direct visits have no referrer. */ }

    const page = {
      page_location: `${location.origin}${location.pathname}`,
      page_referrer: referrer,
      page_title: document.title,
      ...(debug ? { debug_mode: true } : {})
    };
    window.gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    window.gtag('set', page);
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      ...page,
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_domain: hostname,
      cookie_path: '/'
    });
    window.gtag('event', 'page_view', page);

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
  }

  function stopAnalytics() {
    window[disableKey] = true;
    if (!started) return;
    const names = ['_ga', `_ga_${measurementId.slice(2)}`];
    for (const name of names) {
      for (const domain of ['', hostname, `.${hostname}`]) {
        document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax; Secure${domain ? `; Domain=${domain}` : ''}`;
      }
    }
    // Reload removes the already loaded tag; the saved refusal prevents loading it again.
    location.reload();
  }

  function choose(value, save = true) {
    consent = value;
    if (save) {
      try { localStorage.setItem(consentKey, value); } catch (_) { /* Choice still applies to this page. */ }
    }
    showPanel(value !== 'granted' && value !== 'denied');
    if (value === 'granted') startAnalytics();
    else stopAnalytics();
  }

  settings.hidden = false;
  settings.addEventListener('click', () => {
    showPanel(panel.hidden);
    if (!panel.hidden) panel.querySelector('button').focus();
  });
  panel.addEventListener('click', event => {
    const button = event.target.closest?.('button[data-analytics-consent]');
    if (button) choose(button.dataset.analyticsConsent);
  });
  document.addEventListener('click', event => {
    if (consent !== 'granted' || !started || event.defaultPrevented) return;
    const anchor = event.target.closest?.('a[href]');
    if (!anchor) return;
    let destination;
    try { destination = new URL(anchor.href); } catch (_) { return; }
    if (destination.origin !== 'https://apps.apple.com' || destination.pathname !== '/kr/app/id6763057739' ||
        destination.username || destination.password) return;
    window.gtag('event', 'click', {
      send_to: measurementId,
      link_domain: 'apps.apple.com',
      link_url: appStoreUrl,
      outbound: true,
      ...(debug ? { debug_mode: true } : {})
    });
  });
  window.addEventListener('storage', event => {
    if (event.key === consentKey || event.key === null) choose(event.newValue, false);
  });

  if (consent === 'granted') choose(consent, false);
  else {
    window[disableKey] = true;
    showPanel(consent !== 'denied');
  }
})();
