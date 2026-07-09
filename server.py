from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import os
from pathlib import Path


ROOT = Path(__file__).parent
PORT = int(os.environ.get("PORT", "4173"))


class SpaHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        target = self.path.split("?", 1)[0]
        if "." not in Path(target).name and not (ROOT / target.lstrip("/")).exists():
            self.path = "/index.html"
        return super().do_GET()


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", PORT), SpaHandler)
    print(f"Serving MAXXFIT LABS Research Storefront at http://127.0.0.1:{PORT}")
    server.serve_forever()
