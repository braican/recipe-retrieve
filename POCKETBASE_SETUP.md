# PocketBase Setup on Linode

This guide sets up PocketBase on your existing Linode VPS with Nginx + HTTPS.

---

## 1. SSH into your Linode

```bash
ssh root@YOUR_LINODE_IP
```

---

## 2. Create a dedicated user (optional but recommended)

```bash
adduser pb
usermod -aG sudo pb
su - pb
```

---

## 3. Download PocketBase

```bash
mkdir -p /home/pb/pocketbase && cd /home/pb/pocketbase

# Check latest version at https://github.com/pocketbase/pocketbase/releases
PB_VERSION="0.22.18"
wget https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip

unzip pocketbase_${PB_VERSION}_linux_amd64.zip
chmod +x pocketbase
rm pocketbase_${PB_VERSION}_linux_amd64.zip
```

---

## 4. Test it runs

```bash
./pocketbase serve --http="0.0.0.0:8090"
# Visit http://YOUR_LINODE_IP:8090/_/ to confirm it works
# Ctrl+C to stop
```

---

## 5. Create a systemd service

```bash
sudo nano /etc/systemd/system/pocketbase.service
```

Paste this (adjust paths if you used a different user):

```ini
[Unit]
Description=PocketBase
After=network.target

[Service]
Type=simple
User=pb
WorkingDirectory=/home/pb/pocketbase
ExecStart=/home/pb/pocketbase/pocketbase serve --http="127.0.0.1:8090"
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable pocketbase
sudo systemctl start pocketbase
sudo systemctl status pocketbase   # should show "active (running)"
```

---

## 6. Install Nginx

```bash
sudo apt update
sudo apt install -y nginx
```

---

## 7. Point a subdomain at your Linode

In your DNS provider, create an **A record**:

```
pb.yourdomain.com  →  YOUR_LINODE_IP
```

Wait a few minutes for DNS to propagate.

---

## 8. Configure Nginx as reverse proxy

```bash
sudo nano /etc/nginx/sites-available/pocketbase
```

Paste:

```nginx
server {
    listen 80;
    server_name pb.yourdomain.com;

    location / {
        proxy_pass         http://127.0.0.1:8090;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection "upgrade";
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_read_timeout 360s;
    }
}
```

Enable it:

```bash
sudo ln -s /etc/nginx/sites-available/pocketbase /etc/nginx/sites-enabled/
sudo nginx -t          # should say "syntax is ok"
sudo systemctl reload nginx
```

---

## 9. Add HTTPS with Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d pb.yourdomain.com
# Follow prompts — choose to redirect HTTP to HTTPS
```

Certbot auto-renews. Test renewal with:

```bash
sudo certbot renew --dry-run
```

---

## 10. Set up PocketBase admin

Visit `https://pb.yourdomain.com/_/` and create your admin account.

---

## 11. Create the `recipes` collection

In the PocketBase Admin UI → Collections → New collection named **`recipes`**:

| Field        | Type        | Options                          |
|-------------|-------------|----------------------------------|
| title        | Text        | Required                         |
| description  | Text        | —                                |
| servings     | Text        | —                                |
| prep_time    | Text        | —                                |
| cook_time    | Text        | —                                |
| ingredients  | JSON        | —                                |
| steps        | JSON        | —                                |
| tags         | JSON        | —                                |
| notes        | Text        | —                                |
| source_url   | URL         | —                                |
| source_type  | Select      | Values: manual, instagram        |
| image        | File        | Max 1 file, image types only     |
| owner        | Relation    | → users collection, required     |

**Collection rules** (API Rules tab):
- List/Search: `owner = @request.auth.id`
- View: `owner = @request.auth.id`
- Create: `@request.auth.id != ""`
- Update: `owner = @request.auth.id`
- Delete: `owner = @request.auth.id`

---

## 12. Enable Google OAuth in PocketBase

1. Go to **Settings → Auth providers → Google**
2. Enable it
3. Paste your **Google OAuth Client ID** and **Client Secret**
4. Set the Redirect URL to: `https://pb.yourdomain.com/api/oauth2-redirect`
5. In Google Cloud Console, add that redirect URL to your OAuth app's authorized redirect URIs

---

## 13. Configure your frontend .env

```bash
# .env.local in your recipe-retrieve project
VITE_POCKETBASE_URL=https://pb.yourdomain.com
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key
```

---

## 14. Deploy frontend to Netlify

```bash
# In your project root
npm run build
# Deploy the dist/ folder to Netlify
# Or connect your Git repo — Netlify will auto-build on push
```

Set the same env vars in **Netlify → Site Settings → Environment Variables**.

---

That's it! Your stack:
- `https://pb.yourdomain.com` — PocketBase API + Admin UI
- `https://your-site.netlify.app` — React frontend
