import asyncio,json
from playwright.async_api import async_playwright
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(headless=True);report=[]
  for w,h in [(1440,500),(390,844),(375,667)]:
   c=await b.new_context(viewport={'width':w,'height':h},is_mobile=w<860,has_touch=w<860)
   page=await c.new_page();await page.goto('http://127.0.0.1:8827/index.html');await page.wait_for_timeout(1700)
   await page.locator('.menu-mobile' if w<860 else '.menu-btn').click();await page.wait_for_timeout(500)
   panel=page.locator('#mega')
   if w>=860:
    await page.mouse.move(600,300);await page.mouse.wheel(0,700);await page.wait_for_timeout(600)
    assert await panel.evaluate('e=>e.scrollTop')>0
   else:
    session=await c.new_cdp_session(page)
    await session.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':180,'y':570}]})
    for y in range(550,140,-25):
     await session.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':180,'y':y}]});await page.wait_for_timeout(15)
    await session.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
    await page.wait_for_timeout(300);assert await panel.evaluate('e=>e.scrollTop')>0
   report.append({'viewport':[w,h],'scrollTop':await panel.evaluate('e=>e.scrollTop'),'lenis':await page.evaluate('!!window.__lenis')})
   await c.close()
  await b.close();open('/workspace/preise-nav2/normal-motion.json','w').write(json.dumps(report,indent=2));print(report)
asyncio.run(main())
