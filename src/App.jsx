import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout';
import { RepositoryList, RepositoryDetail } from './components/features/repository';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<RepositoryList />} />
            <Route path="/repository/:repoName" element={<RepositoryDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
