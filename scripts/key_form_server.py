#!/usr/bin/env python3
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs
from pathlib import Path

ROOT = Path("/workspace/Kursusoversigt")
ENV = ROOT / ".env"
HELPER = ROOT / "PUT_KEYS_HERE.txt"

HTML = """<!DOCTYPE html>
<html lang=da><head><meta charset=utf-8><title>Kursusoversigt keys</title>
<style>
body{font-family:system-ui;max-width:720px;margin:2rem auto;padding:0 1rem;background:#f6f4ef;color:#1a1a1a}
label{display:block;margin-top:1rem;font-weight:600}
input,textarea{width:100%;padding:.6rem;font-family:ui-monospace,monospace;font-size:13px}
button{margin-top:1.25rem;padding:.7rem 1.2rem;background:#2f5d50;color:#fff;border:0;border-radius:8px;font-size:1rem;cursor:pointer}
.note{color:#555;font-size:.95rem}
</style></head><body>
<h1>Indsæt Supabase-nøgler</h1>
<p class=note>URL er allerede sat. Indsæt anon + service_role fra API Keys (Legacy). Gemmes kun lokalt i .env på denne computer.</p>
<form method=POST>
<label>PUBLIC_SUPABASE_ANON_KEY</label>
<textarea name=anon rows=4 required placeholder="eyJ..."></textarea>
<label>SUPABASE_SERVICE_ROLE_KEY</label>
<textarea name=service rows=4 required placeholder="eyJ..."></textarea>
<label>ADMIN_PASSWORD (valgfri)</label>
<input name=admin placeholder="change-me" />
<button type=submit>Gem i .env</button>
</form>
</body></html>"""

DONE = """<!DOCTYPE html><html lang=da><head><meta charset=utf-8><title>Gemt</title></head>
<body style="font-family:system-ui;max-width:640px;margin:3rem auto">
<h1>Gemt</h1><p>Nøglerne er skrevet til .env. Giv skærmen tilbage til assistenten.</p>
</body></html>"""

class H(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()
        self.wfile.write(HTML.encode())
    def do_POST(self):
        n = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(n).decode()
        q = parse_qs(body)
        anon = q.get("anon", [""])[0].strip()
        service = q.get("service", [""])[0].strip()
        admin = q.get("admin", ["change-me"])[0].strip() or "change-me"
        text = (
            "# Public (safe for browser)\n"
            "PUBLIC_SUPABASE_URL=https://xkoonycoccuwprimmjhk.supabase.co\n"
            f"PUBLIC_SUPABASE_ANON_KEY={anon}\n\n"
            "# Server-only\n"
            f"SUPABASE_SERVICE_ROLE_KEY={service}\n"
            f"ADMIN_PASSWORD={admin}\n\n"
            "# Site\n"
            "PUBLIC_SITE_URL=https://kursusoversigten.dk\n"
            "PUBLIC_LEARNAI_URL=https://learnai.nu\n"
        )
        ENV.write_text(text)
        HELPER.write_text(text)
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()
        self.wfile.write(DONE.encode())
    def log_message(self, *args):
        pass

HTTPServer(("127.0.0.1", 8765), H).serve_forever()
