async (page) => {
  page.__tmArticleGoogleAttempts=0;page.__tmArticleStoreAttempts=0;
  await page.context().route('**/*',route=>{
    const host=new URL(route.request().url()).hostname;
    if(/(^|\.)(googletagmanager\.com|google-analytics\.com|analytics\.google\.com)$/.test(host)){
      page.__tmArticleGoogleAttempts++;return route.abort();
    }
    if(host==='apps.apple.com'){page.__tmArticleStoreAttempts++;return route.abort();}
    return route.continue();
  });
  await page.setViewportSize({width:1365,height:900});
  const response=await page.goto('https://tinymoments.site/blog/from-widget-to-the-same-moment/',{waitUntil:'networkidle'});
  await page.getByRole('heading',{level:1,name:'사진 한 장으로 남기는 육아일기, 위젯에서 다시 보기',exact:true}).waitFor();
  return {url:page.url(),http_status:response.status(),title:await page.title(),consent:await page.evaluate(()=>localStorage.getItem('tinymoments.analytics-consent.v1')),
    google_request_attempts:page.__tmArticleGoogleAttempts,store_navigation_attempts:page.__tmArticleStoreAttempts};
}