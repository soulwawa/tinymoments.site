const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(`${__dirname}/../assets/js/analytics.js`, 'utf8');

function browser({ hostname = 'tinymoments.site', protocol = 'https:', stored = null,
  search = '', storageBlocked = false, storageWriteBlocked = false, measurementId = 'G-0123456789' } = {}) {
  const handlers = {};
  const scripts = [];
  const cookies = [];
  const saved = new Map(stored ? [['tinymoments.analytics-consent.v1', stored]] : []);
  const panel = {
    hidden: true,
    addEventListener: (_, listener) => { handlers.panel = listener; },
    querySelector: () => ({ focus: () => {} })
  };
  const settings = {
    hidden: true, setAttribute: () => {},
    addEventListener: (_, listener) => { handlers.settings = listener; }
  };
  const tag = { dataset: { measurementId, hostname: 'tinymoments.site',
    appStoreUrl: 'https://apps.apple.com/kr/app/id6763057739' } };
  const document = {
    title: '작은 위로',
    referrer: 'https://www.google.com/private/email@example.com?token=secret#auth',
    getElementById: id => ({ 'site-analytics': tag, 'analytics-consent': panel,
      'analytics-settings': settings })[id],
    createElement: () => ({}),
    head: { appendChild: script => scripts.push(script) },
    addEventListener: (_, listener) => { handlers.document = listener; }
  };
  Object.defineProperty(document, 'cookie', { set: value => cookies.push(value) });
  const location = { hostname, protocol, origin: `${protocol}//${hostname}`,
    pathname: '/blog/widget/', search, hash: '#private', reloads: 0,
    reload() { this.reloads += 1; } };
  const window = { addEventListener: (_, listener) => { handlers.storage = listener; } };
  const localStorage = {
    getItem(key) { if (storageBlocked) throw new Error('blocked'); return saved.get(key); },
    setItem(key, value) { if (storageBlocked || storageWriteBlocked) throw new Error('blocked'); saved.set(key, value); }
  };
  const context = vm.createContext({ window, document, location, localStorage, URL, URLSearchParams });
  const run = () => vm.runInContext(source, context);
  run();
  return { window, location, panel, settings, scripts, cookies, saved, run,
    events: () => Array.from(window.dataLayer || [], entry => Array.from(entry)),
    choose: value => handlers.panel({ target: { closest: () => ({ dataset: { analyticsConsent: value } }) } }),
    settingsClick: () => handlers.settings(),
    storage: value => handlers.storage({ key: 'tinymoments.analytics-consent.v1', newValue: value }),
    click: (href, defaultPrevented = false) => handlers.document({ defaultPrevented,
      target: { closest: () => ({ href }) } }) };
}

test('first visit and refusal never load Google or prevent the install link', () => {
  const page = browser();
  assert.equal(page.panel.hidden, false);
  assert.equal(page.scripts.length, 0);
  page.click('https://apps.apple.com/kr/app/id6763057739');
  page.choose('denied');
  assert.equal(page.scripts.length, 0);
  assert.equal(page.events().length, 0);
  assert.equal(page.location.reloads, 0);
  assert.equal(page.saved.get('tinymoments.analytics-consent.v1'), 'denied');
  page.settingsClick();
  assert.equal(page.panel.hidden, false);
});

test('only the approved production host and valid real-ID format activate', () => {
  for (const options of [{ hostname: 'localhost' }, { hostname: 'preview.tinymoments.site' },
    { protocol: 'http:' }, { measurementId: '' }, { measurementId: 'G-EXAMPLE' }]) {
    const page = browser({ stored: 'granted', ...options });
    assert.equal(page.scripts.length, 0);
    assert.equal(page.settings.hidden, true);
  }
});

test('grant sends one page view with sanitized page/referrer and advertising disabled', () => {
  const page = browser({ search: '?token=secret&utm_source=email@example.com#auth' });
  page.choose('granted');
  assert.equal(page.scripts.length, 1);
  const events = page.events();
  const config = events.find(event => event[0] === 'config')[2];
  assert.equal(config.page_location, 'https://tinymoments.site/blog/widget/');
  assert.equal(config.page_referrer, 'https://www.google.com/');
  assert.equal(config.send_page_view, false);
  assert.equal(config.allow_google_signals, false);
  assert.equal(config.allow_ad_personalization_signals, false);
  assert.equal(events.filter(event => event[1] === 'page_view').length, 1);
  assert.equal(JSON.stringify(events).includes('secret'), false);
  assert.equal(JSON.stringify(events).includes('email@example.com'), false);
  page.choose('granted');
  page.run();
  assert.equal(page.scripts.length, 1);
  assert.equal(page.events().filter(event => event[1] === 'page_view').length, 1);
});

test('only this exact App Store app generates one sanitized click per user click', () => {
  const page = browser({ stored: 'granted' });
  for (const href of ['https://apps.apple.com/kr/app/id9999999999',
    'https://apps.apple.com.evil.test/kr/app/id6763057739',
    'https://email:secret@apps.apple.com/kr/app/id6763057739',
    'http://apps.apple.com/kr/app/id6763057739', 'mailto:email@example.com',
    'https://tinymoments.site/privacy/']) page.click(href);
  assert.equal(page.events().filter(event => event[1] === 'click').length, 0);
  page.click('https://apps.apple.com/kr/app/id6763057739?token=private#private');
  const clicks = page.events().filter(event => event[1] === 'click');
  assert.equal(clicks.length, 1);
  assert.equal(clicks[0][2].link_url, 'https://apps.apple.com/kr/app/id6763057739');
  assert.equal(clicks[0][2].link_domain, 'apps.apple.com');
  assert.equal(clicks[0][2].outbound, true);
  page.click('https://apps.apple.com/kr/app/id6763057739', true);
  assert.equal(page.events().filter(event => event[1] === 'click').length, 1);
});

test('withdrawal disables analytics, expires its cookies, and reloads without blocking links', () => {
  const page = browser({ stored: 'granted' });
  page.choose('denied');
  assert.equal(page.window['ga-disable-G-0123456789'], true);
  assert.equal(page.saved.get('tinymoments.analytics-consent.v1'), 'denied');
  assert.equal(page.location.reloads, 1);
  assert.equal(page.cookies.length, 6);
  page.click('https://apps.apple.com/kr/app/id6763057739');
  assert.equal(page.events().filter(event => event[1] === 'click').length, 0);
});

test('debug flag affects events, while ordinary visitors have no debug_mode', () => {
  const debug = browser({ stored: 'granted', search: '?analytics_debug=1&token=secret' });
  assert.equal(debug.events().find(event => event[0] === 'config')[2].debug_mode, true);
  debug.click('https://apps.apple.com/kr/app/id6763057739');
  assert.equal(debug.events().find(event => event[1] === 'click')[2].debug_mode, true);
  assert.equal(JSON.stringify(debug.events()).includes('analytics_debug'), false);
  const normal = browser({ stored: 'granted' });
  assert.equal('debug_mode' in normal.events().find(event => event[0] === 'config')[2], false);
  normal.click('https://apps.apple.com/kr/app/id6763057739');
  for (const event of normal.events().filter(event => event[0] === 'event')) {
    assert.equal('debug_mode' in event[2], false);
  }
});

test('blocked local storage remains usable and another tab can withdraw consent', () => {
  const blocked = browser({ storageBlocked: true });
  blocked.choose('denied');
  blocked.settingsClick();
  blocked.choose('granted');
  assert.equal(blocked.scripts.length, 1);
  const otherTab = browser({ stored: 'granted' });
  otherTab.storage('denied');
  assert.equal(otherTab.window['ga-disable-G-0123456789'], true);
  assert.equal(otherTab.location.reloads, 1);
});

test('clearing a saved choice restores the prompt without enabling analytics', () => {
  const page = browser({ stored: 'denied' });
  page.storage(null);
  assert.equal(page.panel.hidden, false);
  assert.equal(page.scripts.length, 0);
});

test('a saved grant is not reused when preference storage becomes read-only', () => {
  const page = browser({ stored: 'granted', storageWriteBlocked: true });
  assert.equal(page.panel.hidden, false);
  assert.equal(page.scripts.length, 0);
  page.choose('denied');
  assert.equal(page.scripts.length, 0);
});
