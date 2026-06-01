# School Application Form (Nuxt 3)

This is a minimal Nuxt 3 app that provides two application forms: Primary and Junior.

Quick start

```bash
cd "School Application Form"
npm install
npm run dev
```

Open http://localhost:3000 and choose Primary or Junior to fill the form.

Next steps
- Add persistent storage (database) or email notifications in `server/api/submit.post.ts`.
- Customize fields and styling as needed.

Google Drive integration
-----------------------

This project can upload generated application PDFs to a Google Drive folder using a service account.

Setup summary:

- Enable the Google Drive API in your Google Cloud project (APIs & Services → Library → Google Drive API → Enable).
- Create a service account (IAM & Admin → Service accounts) and generate a JSON key. Keep the JSON file secret.
- Create a Google Drive folder and copy the folder ID from the URL (https://drive.google.com/drive/folders/<FOLDER_ID>).
- Share the Drive folder with the service account email (give Editor access).
- Set the following environment variables for your development or deployment environment:

	- `GOOGLE_DRIVE_FOLDER_ID` — the folder ID where PDFs will be saved
	- `GOOGLE_SERVICE_ACCOUNT_KEY` — the full JSON contents of the service account key

Local quick-start (PowerShell):

```powershell
$env:GOOGLE_DRIVE_FOLDER_ID = 'your-folder-id'
$env:GOOGLE_SERVICE_ACCOUNT_KEY = Get-Content .\service-account.json -Raw
npm run dev
```

Alternatively add them to a `.env` file (ensure `.env` is in `.gitignore`) or use your deployment platform's secret manager.

