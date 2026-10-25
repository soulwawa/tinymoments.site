async (page) => {
  const check=(value,message)=>{if(!value)throw new Error(message);};
  const results=[];
  check(await page.locator('#analytics-consent').isHidden(),'Consent was not refused');
  check(await page.evaluate(()=>localStorage.getItem('tinymoments.analytics-consent.v1'))==='denied','QA refusal missing');
  for(const item of [{"name": "desktop-1365", "width": 1365, "height": 900, "path": "/Users/eee/dev/tinymoments-site-publication/2026-10-25-widget-article/evidence/widget-article-desktop-1365-2026-10-25.png"}, {"name": "mobile-375", "width": 375, "height": 812, "path": "/Users/eee/dev/tinymoments-site-publication/2026-10-25-widget-article/evidence/widget-article-mobile-375-2026-10-25.png"}, {"name": "mobile-320", "width": 320, "height": 700, "path": "/Users/eee/dev/tinymoments-site-publication/2026-10-25-widget-article/evidence/widget-article-mobile-320-2026-10-25.png"}]){
    await page.setViewportSize({width:item.width,height:item.height});
    for(const selector of ['.post-header h1','.post-content ol','.post-content a']){
      for(const element of await page.locator(selector).all())await element.scrollIntoViewIfNeeded();
    }
    const metrics=await page.evaluate(()=>{
      const body=document.querySelector('.post-content');
      const targets=[document.querySelector('.post-header h1'),...body.querySelectorAll('h2,li,strong,a')];
      const cut=targets.filter(element=>{const r=element.getBoundingClientRect();return r.left<0||r.right>innerWidth+1;}).map(element=>element.textContent.trim());
      return {documentWidth:document.documentElement.scrollWidth,viewportWidth:innerWidth,
        horizontalOverflow:document.documentElement.scrollWidth>innerWidth,clippedTargets:cut,
        orderedItems:body.querySelectorAll('ol>li').length,listStyle:getComputedStyle(body.querySelector('ol')).listStyleType,
        strongWeights:[...body.querySelectorAll('strong')].map(element=>getComputedStyle(element).fontWeight),
        ctas:[...body.querySelectorAll('a')].filter(a=>a.hostname==='apps.apple.com').map(a=>({text:a.textContent,href:a.href})),
        articleImages:body.querySelectorAll('img').length,bodyFontSize:getComputedStyle(body).fontSize,
        pageHeight:document.documentElement.scrollHeight};
    });
    check(!metrics.horizontalOverflow&&metrics.clippedTargets.length===0,'Clipped article at '+item.width);
    check(metrics.orderedItems===3&&metrics.listStyle==='decimal','Ordered list missing');
    check(metrics.strongWeights.length===3&&metrics.strongWeights.every(weight=>Number(weight)>=600),'Emphasis missing');
    check(metrics.ctas.length===2&&metrics.ctas.every(cta=>cta.href==='https://apps.apple.com/kr/app/id6763057739'),'Wrong CTA');
    check(page.__tmArticleGoogleAttempts===0&&page.__tmArticleStoreAttempts===0,'Unexpected tracking or store navigation');
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
    await page.screenshot({path:item.path,fullPage:true});
    results.push({...item,url:page.url(),observed_at:new Date().toISOString(),fullPage:true,...metrics});
  }
  return {screenshots:results,google_request_attempts:page.__tmArticleGoogleAttempts,store_navigation_attempts:page.__tmArticleStoreAttempts,
    liveGrantClicked:false,ownPersistentProfile:true};
}