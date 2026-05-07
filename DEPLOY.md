# Deploying to Vercel + Cloudflare DNS Cutover

This walks you off `DanRRR.github.io` (GitHub Pages) onto Vercel without ever
breaking `danruksujarit.com`.

## TL;DR

1. Push this repo to a new GitHub repo (e.g. `quant-portfolio`).
2. Import it into Vercel; verify it works on `<project>.vercel.app`.
3. Add `danruksujarit.com` and `www.danruksujarit.com` as custom domains in Vercel.
4. In Cloudflare DNS, change the records to point at Vercel and **turn the
   orange cloud OFF (DNS only)** for these records.
5. Once HTTPS is healthy on Vercel, optionally turn the orange cloud back on for
   `www` only (apex must stay DNS-only with this setup).

Plan budget: 30–60 minutes. The risky window is step 4; you can do step 4 on a
preview subdomain first (`new.danruksujarit.com`) if you want zero-risk rollout.

---

## 1. Push the new repo

```bash
cd quant-portfolio
git init -b main
git add .
git commit -m "feat: scaffold quant portfolio (Next.js + MDX + Python)"
gh repo create DanRRR/quant-portfolio --public --source=. --remote=origin --push
```

(Or create the repo in the GitHub UI and `git remote add origin … && git push -u origin main`.)

## 2. Deploy on Vercel

1. Go to <https://vercel.com/new>.
2. Import the `quant-portfolio` repo. Vercel detects Next.js automatically.
3. Don't change any of the build settings — defaults work.
4. Add no env vars yet (the Stooq endpoint in `api/quote.py` needs no key).
5. Click **Deploy**. You'll get a preview URL like
   `quant-portfolio-<hash>.vercel.app`.
6. Verify:
   - `/` renders, the market widget loads three sparklines.
   - `/blog/cointegration-pairs` renders with KaTeX math.
   - `/api/quote?symbols=SPY` returns JSON.

## 3. Add custom domains in Vercel

In the Vercel project → Settings → Domains, add:

- `danruksujarit.com`
- `www.danruksujarit.com`

Vercel will tell you exactly which DNS records it wants. Expect:

| Type  | Name | Value                      | TTL  |
|-------|------|----------------------------|------|
| A     | `@`  | `76.76.21.21`              | Auto |
| CNAME | `www`| `cname.vercel-dns.com`     | Auto |

(Vercel sometimes recommends an `ALIAS`/`ANAME` for the apex if your DNS host
supports it. Cloudflare's CNAME flattening covers this case — you can use a
CNAME on `@` instead of an A record if you prefer; both work.)

## 4. Update Cloudflare DNS

In Cloudflare → DNS → Records:

1. **Find the existing GitHub Pages records** — likely four A records pointing
   at `185.199.108.153 / .109.153 / .110.153 / .111.153`, plus a CNAME for
   `www`. Delete or edit them.
2. **Add the Vercel records** (see table above).
3. **Set Proxy status to DNS only (grey cloud)** for both `@` and `www`.
   This is important: Vercel needs to terminate TLS itself to issue the
   Let's Encrypt cert via the ACME challenge. Orange-cloud (proxied)
   prevents that.
4. Lower TTLs on these records to 2 minutes (Auto in Cloudflare = 5 min)
   *before* you cut over, so a rollback propagates fast. You can do this a day
   in advance.

Within a minute or two, Vercel will show the domains as **Valid Configuration**
and issue certs. The site should now be live at both `danruksujarit.com` and
`www.danruksujarit.com`.

## 5. (Optional) Re-enable Cloudflare proxy

You can turn the orange cloud back on for `www` if you want Cloudflare's CDN/WAF
in front of Vercel. **Leave the apex grey-cloud** — proxying the apex on top of
Vercel's edge is a known footgun and adds nothing.

If you do proxy `www`:
- Set SSL/TLS mode to **Full (strict)** in Cloudflare.
- Set the page rule to forward `danruksujarit.com/*` → `https://www.danruksujarit.com/$1` (301).
- Or do the redirect in `next.config.mjs` and keep things simpler.

## 6. Zero-risk variant (recommended for first cutover)

If you want to verify everything before swinging the apex, do this instead:

1. Add only `new.danruksujarit.com` as a Vercel custom domain.
2. In Cloudflare, add `CNAME new → cname.vercel-dns.com`, grey cloud.
3. Browse `new.danruksujarit.com`, click around for a day.
4. When happy, repeat steps 3–4 for `@` and `www` and remove the `new` record.

## 7. Tear down the old site

Once `danruksujarit.com` is serving from Vercel:

1. In `DanRRR/DanRRR.github.io` repo → Settings → Pages → set Source to
   **None** (or just delete the repo if you don't want it as your username
   site anymore).
2. The CNAME file in that repo is now harmless but you can delete it for tidiness.

## Rollback

If anything goes wrong in step 4, the rollback is "put the old DNS records
back" — which is why we lowered TTLs. The GitHub Pages site is still hosted and
ready; pointing DNS back at `185.199.x.x` restores it within minutes.

## Notes for future-you

- Vercel free tier is plenty for a portfolio. Watch out for serverless function
  invocations / GB-hours if `/api/quote` gets traffic; the
  `Cache-Control: s-maxage=300` header means Vercel's edge caches for 5 minutes.
- You can promote a feature branch to a preview deploy by just pushing it.
  Useful for trying a new strategy write-up before merging.
- Logs: `vercel logs <project>` or the Vercel dashboard → Deployments → Functions.
