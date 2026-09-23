import { useState } from 'react';

const Login = ({ onLogin, onChangePassword }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [submitState, setSubmitState] = useState({ status: 'idle', message: '' });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitState({ status: 'submitting', message: '' });

    try {
      const response = await fetch(import.meta.env.VITE_AUTH_API_URL || '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const responseBody = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(responseBody.message || responseBody.error || `Login failed with status ${response.status}`);
      }

      if (!responseBody.userExists || !responseBody.passwordCorrect) {
        throw new Error(responseBody.message || 'Email or password is incorrect.');
      }

      onLogin();
    } catch (error) {
      setSubmitState({ status: 'error', message: error.message || 'Could not log in.' });
    }
  };

  return (
    <main className="min-h-screen bg-sky-100 px-4 py-8 text-slate-800 sm:px-8 lg:px-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg items-center justify-center">
        <section className="w-full rounded-[clamp(2rem,5vw,3.5rem)] bg-amber-50 p-7 shadow-xl shadow-sky-200/60 sm:p-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">KGEC IT</p>
          <h1 className="text-4xl leading-tight sm:text-5xl">Welcome back</h1>
          <p className="mt-3 text-lg text-slate-600">Sign in to submit questions.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="login-email" className="mb-2 block text-lg">Email</label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                required
                value={credentials.email}
                onChange={(event) => setCredentials((current) => ({ ...current, email: event.target.value }))}
                className="w-full rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 text-lg outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-200"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="mb-2 block text-lg">Password</label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                required
                value={credentials.password}
                onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))}
                className="w-full rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 text-lg outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-200"
              />
            </div>

            <button
              type="submit"
              disabled={submitState.status === 'submitting'}
              className="w-full rounded-2xl bg-slate-800 px-7 py-4 text-lg text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitState.status === 'submitting' ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <button
            type="button"
            onClick={onChangePassword}
            className="mt-5 text-base font-semibold text-teal-700 underline underline-offset-4 hover:text-teal-900"
          >
            Change password
          </button>

          {submitState.message && (
            <p role="alert" className="mt-4 text-rose-800">{submitState.message}</p>
          )}
        </section>
      </div>
    </main>
  );
};

export default Login;
