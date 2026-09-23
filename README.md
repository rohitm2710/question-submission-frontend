# React + Vite

## Question API

Open the `.env` file in this folder and set the POST endpoint used by the form. The variable name must be exactly `VITE_API_URL`:

```env
VITE_API_URL=/api/questions
```

The frontend calls `/api/questions`. Vite forwards that route to the Render backend during local development, and `vercel.json` forwards it after deployment. This avoids browser CORS errors.

If your backend uses a different port or route, update the `target` and `rewrite` values in `vite.config.js`. For example, if your backend route is `http://localhost:5000/questions`, use:

```env
VITE_API_URL=http://localhost:5000/questions
```

Use `http://localhost:PORT/ROUTE` for a local backend. Do not write `https://localhost/3000`; the port comes after a colon: `localhost:3000`. Restart `npm run dev` after changing `.env`.

When the user submits the form, it sends this JSON body:

```json
{
	"statement": "What is 2 + 2?",
	"difficulty": 0,
	"option_a": "3",
	"option_b": "4",
	"option_c": "5",
	"option_d": "6",
	"answer": "b"
}
```

The UI labels difficulty `0` as Easy, `1` as Medium, and `2` as Hard. The dropdown stores the selected option letter in lowercase, such as `a`, `b`, `c`, or `d`, in `answer`. If `VITE_API_URL` is not set, the form posts to `/api/questions` on the current host.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
