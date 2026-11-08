import asyncio,json,re,subprocess
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.async_api import async_playwright
ROOT=Path(__file__).resolve().parents[1]; OUT=Path('/workspace/preise-nav2')
OUT.mkdir(parents=True,exist_ok=True)
async def swipe(c,page):
 session=await c.new_cdp_session(page)
 await session.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':180,'y':570}]})
 for y in range(550,140,-25):
  await session.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':180,'y':y}]}); await page.wait_for_timeout(15)
 await session.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]}); await page.wait_for_timeout(400)
async def main():
 report={'browser':'Chromium, mobile touch emulation; WebKit blocked by missing host libraries and apt mirror errors','tests':[],'httpErrors':[]}
 async with async_playwright() as p:
  b=await p.chromium.launch(headless=True)
  for w,h in [(1440,900),(390,844),(375,667)]:
   c=await b.new_context(viewport={'width':w,'height':h},is_mobile=w<860,has_touch=w<860,reduced_motion='reduce')
   for route in ['index.html','leistungen/seo.html','preise.html']:
    page=await c.new_page(); errors=[]
    page.on('response',lambda r: errors.append({'url':r.url,'status':r.status}) if r.status>=400 else None)
    r=await page.goto('http://127.0.0.1:8827/'+route); assert r.status==200
    await page.wait_for_timeout(1100)
    trigger=page.locator('.menu-mobile' if w<860 else '.menu-btn')
    if w<860: await trigger.tap()
    else:
     await trigger.focus(); await page.keyboard.press('Enter')
    await page.wait_for_timeout(250)
    panel=page.locator('#mega'); assert await panel.locator('.tile').count()==13
    name=f'after-chromium-{w}-{Path(route).stem}'
    await page.screenshot(path=str(OUT/(name+'-menu-top.png')))
    # Real wheel / touch first, then each link via keyboard focus to verify scroll-into-view.
    if w<860:
     before=await panel.evaluate('e=>e.scrollTop'); await swipe(c,page)
     after=await panel.evaluate('e=>e.scrollTop'); assert after>before,(route,w,before,after)
    else:
     await page.mouse.move(800,400); await page.mouse.wheel(0,500)
    for a in await panel.locator('.tile').all():
     await a.focus(); box=await a.bounding_box(); assert box['y']>=50 and box['y']+box['height']<=h+1,(route,w,box)
    last=panel.locator('.mega-extra a').last
    assert await last.inner_text()=='Preise'
    if w<860:
     await last.focus(); box=await last.bounding_box(); assert box['y']+box['height']<=h+1
     await page.screenshot(path=str(OUT/(name+'-menu-bottom.png')))
    assert await page.locator('nav.links a').last.inner_text()=='Preise'
    await page.keyboard.press('Escape'); assert await trigger.get_attribute('aria-expanded')=='false'
    # Tab traversal: all service tiles can be reached, and focus scrolls the panel.
    await trigger.focus(); await page.keyboard.press('Enter')
    visited=set()
    for _ in range(24):
     href=await page.evaluate('document.activeElement?.classList.contains("tile") ? document.activeElement.getAttribute("href") : null')
     if href: visited.add(href)
     await page.keyboard.press('Tab')
    assert len(visited)==13,(route,w,visited)
    await page.keyboard.press('Escape')
    report['tests'].append({'route':route,'viewport':[w,h],'tiles':13,'keyboardReached':len(visited),'touchScroll':w<860,'horizontalOverflow':await page.evaluate('document.documentElement.scrollWidth>innerWidth')})
    assert not report['tests'][-1]['horizontalOverflow']
    if route=='preise.html':
     await page.goto('http://127.0.0.1:8827/preise.html'); await page.wait_for_timeout(500)
     await page.screenshot(path=str(OUT/f'after-{w}-preise-top.png'))
     await page.evaluate("window.scrollTo(0,document.querySelector('#performance').offsetTop-76)"); await page.screenshot(path=str(OUT/f'after-{w}-preise-pakete.png'))
     await page.evaluate("window.scrollTo(0,document.querySelector('#websites').offsetTop-76)"); await page.screenshot(path=str(OUT/f'after-{w}-preise-websites.png'))
     await page.screenshot(path=str(OUT/f'after-{w}-preise-full.png'),full_page=True)
     assert await page.locator('.price-area').count()==13
     catalog=json.loads((ROOT/'docs/preise-leistungskatalog.json').read_text())
     assert await page.locator('.price-list > div').count()==sum(len(v['einmalig'])+len(v['laufend']) for v in catalog.values())+18
    report['httpErrors']+=errors
    await page.close()
   await c.close()
  # HTTP-check all nav and pricing page internal targets; does not send forms or touch production.
  targets=set()
  for f in [ROOT/'index.html',ROOT/'faq.html',ROOT/'prozess.html',ROOT/'preise.html',*(ROOT/'leistungen').glob('*.html')]:
   soup=BeautifulSoup(f.read_text(),'html.parser')
   for a in soup.select('nav.links a,#mega a')+(soup.select('main a') if f.name=='preise.html' else []):
    href=a.get('href','')
    if href.startswith(('http','mailto:','tel:')): continue
    path=(f.parent/href.split('#')[0]).resolve() if href.split('#')[0] else f
    assert path.exists(),(f,href)
    targets.add(str(path.relative_to(ROOT)))
  for target in targets:
   r=await b.new_page(); response=await r.goto('http://127.0.0.1:8827/'+target,wait_until='domcontentloaded'); assert response.status==200,(target,response.status); await r.close()
  report['targetPagesChecked']=len(targets)
  await b.close()
 (OUT/'verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)); print(json.dumps(report,ensure_ascii=False,indent=2))
asyncio.run(main())
