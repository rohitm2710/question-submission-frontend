import { useState } from 'react';
import { apiHeaders } from '../api.js';

const initialFormData = {
  statement: '',
  subject: '',
  difficulty: 0,
  options: {
    A: '',
    B: '',
    C: '',
    D: '',
  },
  correctAnswer: 'a',
};

const Question = ({ onLogout }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [submitState, setSubmitState] = useState({ status: 'idle', message: '' });

  const handleStatementChange = (event) => {
    setFormData((current) => ({ ...current, statement: event.target.value }));
  };

  const handleOptionChange = (letter, value) => {
    setFormData((current) => ({
      ...current,
      options: { ...current.options, [letter]: value },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitState({ status: 'submitting', message: '' });

    try {
      const requestBody = {
        subject: formData.subject,
        statement: formData.statement,
        difficulty: formData.difficulty,
        option_a: formData.options.A,
        option_b: formData.options.B,
        option_c: formData.options.C,
        option_d: formData.options.D,
        answer: formData.correctAnswer,
      };

      const response = await fetch(import.meta.env.VITE_API_URL || '/api/questions', {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;

        try {
          const errorBody = await response.json();
          errorMessage = errorBody.message || errorBody.error || errorMessage;
        } catch {
          // Keep the status message when the server does not return JSON.
        }

        throw new Error(errorMessage);
      }

      setSubmitState({ status: 'success', message: 'Question submitted successfully.' });
      setFormData(initialFormData);
    } catch (error) {
      setSubmitState({ status: 'error', message: error.message || 'Could not submit the question.' });
    }
  };

  return (
    <main className="min-h-screen bg-sky-100 px-4 py-8 text-slate-800 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onLogout}
            className="rounded-xl border-2 border-slate-700 px-5 py-2 text-base font-semibold text-slate-700 transition hover:bg-slate-800 hover:text-white"
          >
            Log out
          </button>
        </div>
        <h1 className="max-w-3xl text-5xl leading-tight sm:text-6xl lg:text-7xl">
          KGEC IT MCQ Question
          <br />
          Submission Portal
        </h1>

        <form onSubmit={handleSubmit} className="mt-12 rounded-[clamp(2rem,5vw,3.5rem)] bg-amber-50 p-7 sm:p-8 lg:p-10">
          <label htmlFor="question" className="mb-3 block text-xl sm:text-2xl">
            Question statement (Max 200 characters)
          </label>
          <textarea
            id="question"
            name="question"
            value={formData.statement}
            onChange={handleStatementChange}
            maxLength={200}
            required
            rows={5}
            className="w-full resize-none rounded-3xl border-2 border-slate-200 bg-white p-5 text-lg text-slate-800 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-4 focus:ring-sky-200"
          />

          <div className="mt-7">
            <label htmlFor="subject" className="mb-3 block text-xl sm:text-2xl">
              Subject
            </label>
            <select
              id="subject"
              name="subject"
              required
              value={formData.subject}
              onChange={(event) => setFormData((current) => ({ ...current, subject: event.target.value }))}
              className="w-full rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 text-lg text-slate-800 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-200"
            >
              <option value="" disabled>Select a subject</option>
              <option value="Shell Scripting">Shell Scripting</option>
              <option value="Python">Python</option>
              <option value="DSA">DSA</option>
            </select>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <span className="sr-only">Choose difficulty</span>
            <button
              type="button"
              aria-pressed={formData.difficulty === 0}
              onClick={() => setFormData((current) => ({ ...current, difficulty: 0 }))}
              className={`rounded-xl border-4 border-emerald-700 px-7 py-2 text-lg text-emerald-800 ${formData.difficulty === 0 ? 'bg-emerald-100' : 'bg-transparent'}`}
            >
              Easy
            </button>
            <button
              type="button"
              aria-pressed={formData.difficulty === 1}
              onClick={() => setFormData((current) => ({ ...current, difficulty: 1 }))}
              className={`rounded-xl border-4 border-amber-500 px-7 py-2 text-lg text-amber-800 ${formData.difficulty === 1 ? 'bg-amber-100' : 'bg-transparent'}`}
            >
              Medium
            </button>
            <button
              type="button"
              aria-pressed={formData.difficulty === 2}
              onClick={() => setFormData((current) => ({ ...current, difficulty: 2 }))}
              className={`rounded-xl border-4 border-rose-700 px-7 py-2 text-lg text-rose-800 ${formData.difficulty === 2 ? 'bg-rose-100' : 'bg-transparent'}`}
            >
              Hard
            </button>
            <span className="text-xl sm:text-2xl">Options (Max 100 characters each)</span>
          </div>

          <div className="mt-7 grid gap-7 sm:grid-cols-2">
            {Object.keys(formData.options).map((letter) => (
              <input
                key={letter}
                type="text"
                name={`option-${letter}`}
                value={formData.options[letter]}
                onChange={(event) => handleOptionChange(letter, event.target.value)}
                maxLength={100}
                required
                placeholder={`Option ${letter}`}
                aria-label={`Option ${letter}`}
                className="w-full rounded-3xl bg-teal-700 px-5 py-5 text-lg text-white outline-none placeholder:text-teal-100 focus:ring-4 focus:ring-teal-300"
              />
            ))}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <label htmlFor="correct-answer" className="text-xl sm:text-2xl">
              Correct answer
            </label>
            <select
              id="correct-answer"
              value={formData.correctAnswer}
              onChange={(event) => setFormData((current) => ({ ...current, correctAnswer: event.target.value }))}
              className="rounded-2xl bg-sky-50 px-5 py-3 text-lg text-slate-800 outline-none focus:ring-4 focus:ring-sky-300"
            >
              {Object.keys(formData.options).map((letter) => (
                <option key={letter} value={letter.toLowerCase()}>{letter}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={submitState.status === 'submitting'}
            className="mt-8 rounded-2xl bg-slate-800 px-7 py-3 text-lg text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitState.status === 'submitting' ? 'Submitting...' : 'Submit question'}
          </button>

          {submitState.message && (
            <p role="status" className={`mt-4 text-lg ${submitState.status === 'error' ? 'text-rose-800' : 'text-emerald-800'}`}>
              {submitState.message}
            </p>
          )}
        </form>

        <p className="mt-5 max-w-3xl text-2xl leading-tight sm:text-3xl">
          NOTE: Questions will be sent to database for randomization
        </p>
      </div>
    </main>
  );
};

export default Question;