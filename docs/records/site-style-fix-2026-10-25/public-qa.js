async (page) => {
  const check=(value,message)=>{if(!value)throw new Error(message);};
  const results=[];
  for(const item of [{"kind": "blog", "url": "https://tinymoments.site/blog/", "name": "desktop-1365", "width": 1365, "height": 900, "path": "/Users/eee/dev/tinymoments.site/docs/evidence/blog-list-divider-after-desktop-1365-2026-10-25.png"}, {"kind": "blog", "url": "https://tinymoments.site/blog/", "name": "mobile-375", "width": 375, "height": 812, "path": "/Users/eee/dev/tinymoments.site/docs/evidence/blog-list-divider-after-mobile-375-2026-10-25.png"}, {"kind": "blog", "url": "https://tinymoments.site/blog/", "name": "mobile-320", "width": 320, "height": 700, "path": "/Users/eee/dev/tinymoments.site/docs/evidence/blog-list-divider-after-mobile-320-2026-10-25.png"}, {"kind": "article", "url": "https://tinymoments.site/blog/from-widget-to-the-same-moment/", "name": "desktop-1365", "width": 1365, "height": 900, "path": "/Users/eee/dev/tinymoments.site/docs/evidence/widget-title-wrap-after-desktop-1365-2026-10-25.png"}, {"kind": "article", "url": "https://tinymoments.site/blog/from-widget-to-the-same-moment/", "name": "mobile-375", "width": 375, "height": 812, "path": "/Users/eee/dev/tinymoments.site/docs/evidence/widget-title-wrap-after-mobile-375-2026-10-25.png"}, {"kind": "article", "url": "https://tinymoments.site/blog/from-widget-to-the-same-moment/", "name": "mobile-320", "width": 320, "height": 700, "path": "/Users/eee/dev/tinymoments.site/docs/evidence/widget-title-wrap-after-mobile-320-2026-10-25.png"}]){
    await page.setViewportSize({width:item.width,height:item.height});
    if(page.url()===item.url)await page.reload({waitUntil:'networkidle'});
    else await page.goto(item.url,{waitUntil:'networkidle'});
    check(await page.locator('#analytics-consent').isHidden(),'QA refusal not preserved');
    const metrics=await page.evaluate(kind=>{
      const result={noHorizontalOverflow:document.documentElement.scrollWidth<=innerWidth};
      if(kind==='blog'){
        result.borders=[...document.querySelectorAll('.post-list>li')].map(li=>({item:getComputedStyle(li).borderBottomWidth,link:getComputedStyle(li.querySelector('a')).borderBottomWidth}));
      }else{
        const h1=document.querySelector('.post-header h1'),text=h1.firstChild;
        result.wordBreak=getComputedStyle(h1).wordBreak;result.title=h1.textContent;result.titleLines=[];
        for(let i=0;i<text.textContent.length;i++){
          const range=document.createRange();range.setStart(text,i);range.setEnd(text,i+1);
          const top=Math.round(range.getBoundingClientRect().top);
          let row=result.titleLines.find(row=>row.top===top);if(!row){row={top,text:''};result.titleLines.push(row);}row.text+=text.textContent[i];
        }
        result.titleLines=result.titleLines.map(row=>row.text.trim()).filter(Boolean);
        result.wordRows=['육아일기','보기'].map(word=>{
          const at=text.textContent.indexOf(word),range=document.createRange();range.setStart(text,at);range.setEnd(text,at+word.length);
          return {word,rows:new Set([...range.getClientRects()].map(r=>Math.round(r.top))).size};
        });
        result.inlineLinkBorders=[...document.querySelectorAll('.post-content a')].map(a=>getComputedStyle(a).borderBottomWidth);
      }
      return result;
    },item.kind);
    check(metrics.noHorizontalOverflow,'Horizontal clipping at '+item.url+' '+item.width);
    if(item.kind==='blog'){
      check(metrics.borders.every((b,i)=>b.link==='0px'&&b.item===(i===metrics.borders.length-1?'0px':'1px')),'Double divider remains');
    }else{
      check(metrics.wordBreak==='keep-all'&&metrics.wordRows.every(word=>word.rows===1),'Title splits inside a word');
      check(metrics.inlineLinkBorders.every(border=>border==='1px'),'Article link underline removed');
    }
    check(page.__tmStyleGoogleAttempts===0&&page.__tmStyleStoreAttempts===0,'Unexpected GA or store navigation');
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
    await page.screenshot({path:item.path,fullPage:true});
    results.push({...item,observed_at:new Date().toISOString(),...metrics});
  }
  await page.goto('https://tinymoments.site/release/',{waitUntil:'networkidle'});
  const releaseBorders=await page.locator('.post-list>li').evaluateAll(items=>items.map(li=>({item:getComputedStyle(li).borderBottomWidth,link:getComputedStyle(li.querySelector('a')).borderBottomWidth})));
  check(releaseBorders.every((b,i)=>b.link==='0px'&&b.item===(i===releaseBorders.length-1?'0px':'1px')),'Release list regression');
  await page.locator('.post-list a').first().focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');
  const focus=await page.locator('.post-list a').first().evaluate(a=>({visible:a.matches(':focus-visible'),style:getComputedStyle(a).outlineStyle,width:getComputedStyle(a).outlineWidth}));
  check(focus.visible&&focus.style!=='none'&&parseFloat(focus.width)>0,'Keyboard focus outline lost');
  return {screenshots:results,releaseBorders,keyboardFocus:focus,googleRequests:page.__tmStyleGoogleAttempts,storeNavigations:page.__tmStyleStoreAttempts,liveGrantClicked:false};
}