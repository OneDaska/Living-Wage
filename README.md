# Ghana Living Wage Report 2025

Static landing page for the Ghana Living Wage Report 2025.

Custom domain: https://ghanalivingwage.com

## Deploy to Hostinger

The repository includes a manual GitHub Actions workflow at
`.github/workflows/deploy-hostinger.yml`.

Create these repository secrets under **Settings → Secrets and variables → Actions**:

- `HOSTINGER_FTP_HOST`: the FTP IP shown in Hostinger
- `HOSTINGER_FTP_USERNAME`: the Hostinger FTP username
- `HOSTINGER_FTP_PASSWORD`: the Hostinger FTP password
- `HOSTINGER_FTP_PATH`: the domain's destination directory, commonly `public_html` or `/`

Then open **Actions → Deploy to Hostinger → Run workflow**. The workflow uploads
the website from `main` without deleting unrelated remote files.
