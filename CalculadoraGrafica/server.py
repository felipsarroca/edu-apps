import http.server
import socketserver
import os
from functools import partial

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.getcwd(), **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()

if __name__ == "__main__":
    PORT = 8000
    
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"Servidor iniciat a http://localhost:{PORT}")
        print("Prem Ctrl+C per aturar el servidor")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor aturat.")