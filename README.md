# KGEC IT Question Submission Portal

A React and Vite frontend for authenticated multiple-choice question submission. Users sign in, optionally change their password, and submit questions with a difficulty level, four options, and the correct answer.

## Features

- Email and password authentication
- Password-change workflow
- Question statement with a 200-character limit
- Easy, Medium, and Hard difficulty selection
- Four answer options with a lowercase correct-answer value
- JSON POST requests to the question and authentication APIs
- Vite and Vercel rewrites to keep browser requests same-origin

## Technology

- React 19
- Vite
- Tailwind CSS
- Vercel deployment configuration

## Local Development

```bash
npm install
npm run dev
```

The development server is normally available at `http://localhost:5173`.

Run the checks with:

```bash
npm run lint
npm run build
```

## API Configuration

The frontend uses same-origin paths. Vite proxies them during local development, and `vercel.json` forwards them after deployment.

| Frontend path | Production destination |
| --- | --- |
| `/api/auth/login` | `https://question-submission-auth-lftb1zeg7-rohit-s-team6.vercel.app/api/login` |
| `/api/auth/change-password` | `https://question-submission-auth-lftb1zeg7-rohit-s-team6.vercel.app/api/change-password` |
| `/api/questions` | `https://question-submission-backend.onrender.com/v1/questions` |

No database credentials or private API keys belong in this frontend repository. `.env` is ignored by Git.

## Authentication API

### Login

The login form sends `POST /api/login` with:

```json
{
  "email": "user@example.com",
  "password": "mypassword"
}
```

The frontend treats login as successful only when both `userExists` and `passwordCorrect` are `true`:

```json
{
  "userExists": true,
  "passwordCorrect": true,
  "message": "Password is correct"
}
```

The API may return HTTP 200 for invalid credentials. The response flags, not only the HTTP status, determine whether access is granted.

### Change Password

The change-password form sends `POST /api/change-password` with:

```json
{
  "email": "user@example.com",
  "currentPassword": "old-password",
  "newPassword": "new-password"
}
```

The frontend treats the operation as successful only when `passwordChanged` is `true`:

```json
{
  "passwordChanged": true,
  "message": "Password changed successfully"
}
```

## Question API

The question form sends `POST /v1/questions` through the `/api/questions` rewrite:

```json
{
  "subject": "Python",
  "difficulty": 0,
  "statement": "What is 2 + 2?",
  "option_a": "3",
  "option_b": "4",
  "option_c": "5",
  "option_d": "6",
  "answer": "b"
}
```

The `subject` value is one of `Shell Scripting`, `Python`, or `DSA`. Difficulty values are `0` for Easy, `1` for Medium, and `2` for Hard. The `answer` value is lowercase: `a`, `b`, `c`, or `d`.

## Vercel Deployment

1. Import the GitHub repository into Vercel.
2. Set the root directory to the repository root.
3. Use the Vite preset.
4. Set the build command to `npm run build`.
5. Set the output directory to `dist`.
6. Set the install command to `npm install`.
7. Deploy the project.

The included `vercel.json` forwards the three frontend API paths to their Render services. Redeploy after changing rewrite rules.

## Security

- Never commit `.env`, database URLs, passwords, or private tokens.
- The API should hash passwords with bcrypt or Argon2 before production use.
- Validate and rate-limit authentication requests on the backend.
- Restrict CORS to trusted frontend origins when direct API access is enabled.
