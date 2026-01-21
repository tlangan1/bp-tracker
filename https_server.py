#!/usr/bin/env python3
"""
Simple HTTPS server for the Blood Pressure Tracker app
"""
import http.server
import ssl
import os

# Server configuration
PORT = 8443
CERTFILE = "cert.pem"
KEYFILE = "key.pem"

class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def main():
    # Check if certificate exists
    if not os.path.exists(CERTFILE) or not os.path.exists(KEYFILE):
        print("SSL certificate not found. Generating self-signed certificate...")
        os.system(f'openssl req -new -x509 -keyout {KEYFILE} -out {CERTFILE} -days 365 -nodes -subj "/CN=localhost"')
        print(f"Certificate generated: {CERTFILE}")
    
    # Create HTTPS server
    server_address = ('0.0.0.0', PORT)
    httpd = http.server.HTTPServer(server_address, CORSRequestHandler)
    
    # Wrap with SSL
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.load_cert_chain(certfile=CERTFILE, keyfile=KEYFILE)
    httpd.socket = context.wrap_socket(httpd.socket, server_side=True)
    
    print(f"\n{'='*60}")
    print(f"HTTPS Server started successfully!")
    print(f"{'='*60}")
    print(f"Local access:     https://localhost:{PORT}")
    print(f"Network access:   https://YOUR_LOCAL_IP:{PORT}")
    print(f"{'='*60}")
    print(f"\nNote: You'll see a security warning because this is a")
    print(f"self-signed certificate. Click 'Advanced' and 'Proceed'.")
    print(f"\nPress Ctrl+C to stop the server\n")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\nServer stopped.")
        httpd.shutdown()

if __name__ == '__main__':
    main()
