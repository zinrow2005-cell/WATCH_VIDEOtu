
import os, sys, threading, http.server, socketserver, time
try:
    from playwright.sync_api import sync_playwright
except Exception as e:
    print("NO_PLAYWRIGHT",e); sys.exit(3)
root=sys.argv[1]
os.chdir(root)
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
srv=socketserver.TCPServer(("127.0.0.1",0),Q)
port=srv.server_address[1]
threading.Thread(target=srv.serve_forever,daemon=True).start()
errors=[]
try:
  with sync_playwright() as p:
    browser=None
    for launcher in (p.chromium,p.webkit,p.firefox):
      try:
        browser=launcher.launch(headless=True); break
      except Exception:
        pass
    if not browser:
      print("NO_BROWSER"); sys.exit(4)
    for width,height,label in [(1366,768,"desktop"),(1024,768,"tablet"),(390,844,"phone")]:
      page=browser.new_page(viewport={"width":width,"height":height})
      local_errors=[]
      page.on("pageerror",lambda e,arr=local_errors: arr.append(str(e)))
      page.goto(f"http://127.0.0.1:{port}/",wait_until="domcontentloaded",timeout=10000)
      page.wait_for_timeout(500)
      # top modes
      for bid in ["videoModeBtn","musicModeBtn","ktvModeBtn","tvModeBtn"]:
        loc=page.locator("#"+bid)
        if loc.count():
          try: loc.click(force=True,timeout=1500); page.wait_for_timeout(120)
          except Exception as e: local_errors.append(f"{bid}:{e}")
      # KTV index core
      if page.locator("#ktvModeBtn").count():
        try:
          page.locator("#ktvModeBtn").click(force=True)
          page.wait_for_timeout(150)
          for val in ["zh","ㄇ","ㄓ","ㄌ","A"]:
            btn=page.locator(f'.ktv-letter[data-letter="{val}"]')
            if btn.count():
              btn.click(force=True); page.wait_for_timeout(80)
        except Exception as e:
          local_errors.append("ktv-index:"+str(e))
      print(label,"PASS" if not local_errors else "ERRORS:"+repr(local_errors[:5]))
      errors.extend(local_errors)
      page.close()
    browser.close()
finally:
  srv.shutdown()
sys.exit(0 if not errors else 5)
