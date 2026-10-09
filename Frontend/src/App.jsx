import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ToastProvider } from "./components/Toast";
import Home from "./pages/Home";
import CreateQuiz from "./pages/CreateQuiz";
import QuizDetail from "./pages/QuizDetail";
import TakeQuiz from "./pages/TakeQuiz";
import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/quiz/:quizId/play" element={<TakeQuiz />} />

          <Route
            path="*"
            element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/create" element={<CreateQuiz />} />
                  <Route path="/quiz/:quizId" element={<QuizDetail />} />
                  <Route path="/quiz/:quizId/edit" element={<CreateQuiz />} />
                </Routes>
              </>
            }
          />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}