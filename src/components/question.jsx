import { useState } from 'react';

const initialFormData = {
  statement: '',
  difficulty: 0,
  options: {
    A: '',
    B: '',
    C: '',
    D: '',
  },
  correctAnswer: 'a',
};

const Question = () => {
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
        headers: { 'Content-Type': 'application/json' },
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
    <main className="min-h-screen bg-lime-300 px-4 py-8 text-stone-600 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="max-w-3xl text-5xl leading-tight sm:text-6xl lg:text-7xl">
          KGEC IT MCQ Question
          <br />
          Submission Portal
        </h1>

        <form onSubmit={handleSubmit} className="mt-12 rounded-[clamp(2rem,5vw,3.5rem)] bg-orange-300 p-7 sm:p-8 lg:p-10">
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
            className="w-full resize-none rounded-3xl bg-indigo-200 p-5 text-lg text-stone-700 outline-none placeholder:text-stone-500 focus:ring-4 focus:ring-indigo-300"
          />

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <span className="sr-only">Choose difficulty</span>
            <button
              type="button"
              aria-pressed={formData.difficulty === 0}
              onClick={() => setFormData((current) => ({ ...current, difficulty: 0 }))}
              className={`rounded-xl border-4 border-green-700 px-7 py-2 text-lg text-green-700 ${formData.difficulty === 0 ? 'bg-green-200' : 'bg-transparent'}`}
            >
              Easy
            </button>
            <button
              type="button"
              aria-pressed={formData.difficulty === 1}
              onClick={() => setFormData((current) => ({ ...current, difficulty: 1 }))}
              className={`rounded-xl border-4 border-yellow-500 px-7 py-2 text-lg text-yellow-800 ${formData.difficulty === 1 ? 'bg-yellow-200' : 'bg-transparent'}`}
            >
              Medium
            </button>
            <button
              type="button"
              aria-pressed={formData.difficulty === 2}
              onClick={() => setFormData((current) => ({ ...current, difficulty: 2 }))}
              className={`rounded-xl border-4 border-red-700 px-7 py-2 text-lg text-red-700 ${formData.difficulty === 2 ? 'bg-red-200' : 'bg-transparent'}`}
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
                className="w-full rounded-3xl bg-green-600 px-5 py-5 text-lg text-white outline-none placeholder:text-green-100 focus:ring-4 focus:ring-green-300"
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
              className="rounded-2xl bg-indigo-200 px-5 py-3 text-lg text-stone-700 outline-none focus:ring-4 focus:ring-indigo-300"
            >
              {Object.keys(formData.options).map((letter) => (
                <option key={letter} value={letter.toLowerCase()}>{letter}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={submitState.status === 'submitting'}
            className="mt-8 rounded-2xl bg-stone-700 px-7 py-3 text-lg text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitState.status === 'submitting' ? 'Submitting...' : 'Submit question'}
          </button>

          {submitState.message && (
            <p role="status" className={`mt-4 text-lg ${submitState.status === 'error' ? 'text-red-800' : 'text-green-900'}`}>
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