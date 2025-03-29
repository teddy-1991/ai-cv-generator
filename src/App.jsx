import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CVInput from './pages/CVInput'; 
import CoverLetterScreen from './pages/CoverLetterScreen';
import 'bootstrap/dist/css/bootstrap.min.css';
import KeywordCheckScreen from './pages/KeywordCheckScreen';

function App() {
  return (
    <div>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cv-input" element={<CVInput />} />
        <Route path="/cover-letter" element={<CoverLetterScreen />} />
        <Route path="/keywords" element={<KeywordCheckScreen />} />
        </Routes>
    </div>
  );
};

export default App;
