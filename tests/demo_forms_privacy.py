import asyncio, json, os, re
from pathlib import Path
from urllib.parse import unquote
from playwright.async_api import async_playwright
BASE=os.environ.get('DEMO_BASE_URL','http://127.0.0.1:8879/projekt-ep-vorschau/')
PAGES=['referenzen/feld/','referenzen/lumen/','referenzen/quartier/','referenzen/holm/','referenzen/volta/','referenzen/waermewerk/','referenzen/nivora/','referenzen/nivora/shop/','referenzen/orbit/','vorschau/orbit/','vorschau/loeschservice/']
async def main():
 results=[]
 async with async_playwright() as p:
  browser=await p.chromium.launch(headless=True,args=['--no-sandbox','--disable-webgl'])
  for js in [True,False]:
   for path in PAGES:
    context=await browser.new_context(java_script_enabled=js,reduced_motion='reduce', viewport={'width':1440,'height':1000})
    page=await context.new_page(); requests=[];errors=[]
    page.on('request',lambda r:requests.append({'url':r.url,'method':r.method,'body':r.post_data or '', 'headers':r.headers}))
    page.on('pageerror',lambda e:errors.append(str(e)+' '+str(e.stack)))
    await page.goto(BASE+path,wait_until='networkidle',timeout=60000)
    await page.wait_for_timeout(500)
    # QUARTIER's decorative preloader is not dismissed after a WebGL context error.
    # Remove only that overlay to isolate input privacy from the separate 3D fallback.
    if path=='referenzen/quartier/':
     await page.locator('.veil').evaluate_all('(elements)=>elements.forEach(el=>el.remove())')
    assert await page.locator('form').count()==0, (path,'native form remains')
    demos=page.locator('[data-local-demo], [data-local-calculator]'); count=await demos.count()
    assert count>0,(path,'missing local input container')
    for i in range(count):
     demo=demos.nth(i)
     # Dialogs are closed on load; open as fixture, including with site JS disabled.
     await demo.evaluate('(el)=>{const d=el.closest("dialog"); if(d&&!d.open)d.showModal()}')
     await demo.scroll_into_view_if_needed()
     initial_status=await demo.locator('.demo-local-status').all_text_contents()
     start=page.url; before=len(requests); markers=[];enter_count=0
     for slider in await demo.locator('input[type=range]').all():
      await slider.evaluate('(el)=>{el.value=el.min;el.dispatchEvent(new Event("input",{bubbles:true}))}')
      await slider.press('Enter');enter_count+=1
      assert page.url==start,(path,js,'Slider Enter changed URL')
     inputs=demo.locator('input:not([type=radio]):not([type=checkbox]):not([type=hidden]):not([type=range]),textarea')
     for n in range(await inputs.count()):
      el=inputs.nth(n);typ=await el.get_attribute('type') or ''
      marker=f'DEMOTEST{len(results)}X{n}';value=marker+'@example.invalid' if typ=='email' else marker
      if typ=='tel': value='0300000000'+str(n)
      if await el.is_visible() and await el.is_enabled():
       await el.fill(value);markers.append(value)
       if await el.evaluate('(el)=>el.tagName!=="TEXTAREA"'):
        await el.press('Enter');enter_count+=1
        assert page.url==start,(path,js,'Enter changed URL',page.url)
     for cb in await demo.locator('input[type=checkbox]').all():
      if await cb.is_visible() and await cb.is_enabled():await cb.check(force=True)
     buttons=demo.locator('[data-local-confirm]');clicks=await buttons.count()
     for n in range(clicks):
      await buttons.nth(n).evaluate('(el)=>el.scrollIntoView({block:"center",behavior:"instant"})')
      await buttons.nth(n).click(timeout=10000)
      await page.wait_for_timeout(100)
      assert page.url==start,(path,js,'Click changed URL',page.url)
     if js and clicks:
      text=await demo.locator('.demo-local-status').inner_text()
      assert text.startswith(('Lokal bestätigt', 'Demo-Anmeldung vorgemerkt', 'Du bist auf der Demo-Liste')),(path,'missing confirmation',text)
     if not js:
      assert await demo.locator('.demo-local-status').all_text_contents()==initial_status,(path,'No-JS changed confirmation')
     await page.reload(wait_until='networkidle',timeout=60000)
     assert page.url==start,(path,js,'Reload changed URL',page.url)
     serialized=unquote(json.dumps(requests[before:],ensure_ascii=False))
     for marker in markers: assert marker not in serialized,(path,js,'DATA LEAK',marker)
     assert not any(r['method'] not in ['GET','HEAD'] for r in requests[before:]),(path,js,'unexpected write request')
     storage=await page.evaluate('({local:{...localStorage},session:{...sessionStorage}})')
     for marker in markers: assert marker not in json.dumps(storage),(path,js,'stored form value')
     unexpected_errors=[e for e in errors if not (path=='referenzen/quartier/' and 'Error creating WebGL context' in e)]
     assert not unexpected_errors,(path,js,'Unexpected browser error',unexpected_errors)
     results.append({'page':path,'javascript':js,'container':i,'enter_fields':enter_count,'button_clicks':clicks,'reload':True,'url_unchanged':True,'no_request_values':True,'requests_after_input':len(requests)-before,'storage_keys':storage,'page_errors':errors})
     print('PASS',path,'JS',js,'container',i,'Enter',enter_count,'clicks',clicks,'errors',len(errors),flush=True)
    await context.close()
  await browser.close()
 Path(os.environ.get('DEMO_FORM_REPORT','/tmp/demo-form-results.json')).write_text(json.dumps(results,indent=2,ensure_ascii=False))
 print('ALL PASS',len(results))
asyncio.run(main())
