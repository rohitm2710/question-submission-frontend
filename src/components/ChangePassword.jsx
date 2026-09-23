import { useState } from 'react';

const ChangePassword = ({ onBack }) => {
  const [formData, setFormData] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [submitState, setSubmitState] = useState({ status: 'idle', message: '' });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setSubmitState({ status: 'error', message: 'New passwords do not match.' });
      return;
    }

    setSubmitState({ status: 'submitting', message: '' });

    try {
      const response = await fetch(import.meta.env.VITE_CHANGE_PASSWORD_API_URL || '/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const responseBody = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(responseBody.message || responseBody.error || `Password change failed with status ${response.status}`);
      }

      if (!responseBody.passwordChanged) {
        throw new Error(responseBody.message || 'Password could not be changed.');
      }

      setSubmitState({ status: 'success', message: 'Password changed successfully.' });
      setFormData({ email: '', currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setSubmitState({ status: 'error', message: error.message || 'Could not change the password.' });
    }
  };

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  return (
    <main className="min-h-screen bg-sky-100 px-4 py-8 text-slate-800 sm:px-8 lg:px-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg items-center justify-center">
        <section className="w-full rounded-[clamp(2rem,5vw,3.5rem)] bg-amber-50 p-7 shadow-xl shadow-sky-200/60 sm:p-10">
          <button type="button" onClick={onBack} className="mb-6 text-base font-semibold text-teal-700 underline underline-offset-4 hover:text-teal-900">
            Back to sign in
          </button>
          <h1 className="text-4xl leading-tight sm:text-5xl">Change password</h1>
          <p className="mt-3 text-lg text-slate-600">Enter your current password and choose a new one.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="change-email" className="mb-2 block text-lg">Email</label>
              <input id="change-email" type="email" required autoComplete="email" value={formData.email} onChange={(event) => updateField('email', event.target.value)} className="w-full rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 text-lg outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-200" />
            </div>
            <div>
              <label htmlFor="current-password" className="mb-2 block text-lg">Current password</label>
              <input id="current-password" type="password" required autoComplete="current-password" value={formData.currentPassword} onChange={(event) => updateField('currentPassword', event.target.value)} className="w-full rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 text-lg outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-200" />
            </div>
            <div>
              <label htmlFor="new-password" className="mb-2 block text-lg">New password</label>
              <input id="new-password" type="password" required autoComplete="new-password" minLength={8} value={formData.newPassword} onChange={(event) => updateField('newPassword', event.target.value)} className="w-full rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 text-lg outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-200" />
            </div>
            <div>
              <label htmlFor="confirm-password" className="mb-2 block text-lg">Confirm new password</label>
              <input id="confirm-password" type="password" required autoComplete="new-password" minLength={8} value={formData.confirmPassword} onChange={(event) => updateField('confirmPassword', event.target.value)} className="w-full rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 text-lg outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-200" />
            </div>
            <button type="submit" disabled={submitState.status === 'submitting'} className="w-full rounded-2xl bg-slate-800 px-7 py-4 text-lg text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60">
              {submitState.status === 'submitting' ? 'Changing password...' : 'Change password'}
            </button>
          </form>

          {submitState.message && (
            <p role="status" className={`mt-4 ${submitState.status === 'error' ? 'text-rose-800' : 'text-emerald-800'}`}>{submitState.message}</p>
          )}
        </section>
      </div>
    </main>
  );
};

export default ChangePassword;
