import { useState } from 'react'
import ChangePassword from './components/ChangePassword.jsx'
import Login from './components/Login.jsx'
import Question from './components/question.jsx'

const App = () => {
  const [page, setPage] = useState('login')

  if (page === 'change-password') {
    return <ChangePassword onBack={() => setPage('login')} />;
  }

  if (page === 'questions') {
    return (
      <Question
        onLogout={() => {
          localStorage.removeItem('authToken');
          setPage('login');
        }}
      />
    );
  }

  return (
    <Login onLogin={() => setPage('questions')} onChangePassword={() => setPage('change-password')} />
  );
};

export default App;