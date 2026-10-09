import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getQuiz, getQuestions } from "../api";
import { useToast } from "../components/Toast";

const TIME_PER_Q = 20;

export default function TakeQuiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);


  const [step, setStep] = useState("intro"); // intro | playing | results
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_Q);

  useEffect(() => {
    Promise.all([getQuiz(quizId), getQuestions(quizId)])
      .then(([q, qs]) => {
        if (!qs.length) { toast("No questions yet", "info"); navigate(`/quiz/${quizId}`); return; }
        setQuiz(q); setQuestions(qs);
      })
      .catch(() => toast("Failed to load", "error"))
      .finally(() => setLoading(false));
  }, [quizId]);


  useEffect(() => {
    if (step !== "playing" || answered) return;
    if (timeLeft <= 0) { handleAnswer(null); return; }
    const t = setTimeout(() => setTimeLeft((x) => x - 1), 1000);
    return () => clearTimeout(t);
  }, [step, answered, timeLeft]);

  const startQuiz = () => {
    setStep("playing"); setCurrent(0); setAnswers([]);
    setSelected(null); setAnswered(false); setTimeLeft(TIME_PER_Q);
  };

  const handleAnswer = useCallback((answerId) => {
    if (answered) return;
    setAnswered(true); setSelected(answerId);
    const q = questions[current];
    const correct = q.answers.some((a) => a.id === answerId && a.is_right);
    setAnswers((prev) => [...prev, { correct }]);
  }, [answered, current, questions]);

  const nextQuestion = () => {
    if (current + 1 >= questions.length) { setStep("results"); return; }
    setCurrent((c) => c + 1); setSelected(null); setAnswered(false); setTimeLeft(TIME_PER_Q);
  };

  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-bg">
        <div className="h-10 w-10 animate-spin-slow rounded-full border-4 border-brand-border border-t-brand-blue" />
      </div>
    );
  }

  const score = answers.filter((a) => a.correct).length;
  const total = questions.length;
  const pct = total ? Math.round((score / total) * 100) : 0;


  if (step === "intro") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-brand-bg px-6 py-12">
        <div className="w-full max-w-xl animate-fade-up flex flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-brand-limeDim bg-brand-limeDim/50 px-3 py-1 text-xs font-semibold text-brand-lime">
            ⚡ Quiz Time
          </span>

          <h1 className="font-display text-6xl leading-none tracking-wide text-brand-text md:text-7xl">
            {quiz?.title}
          </h1>
          {quiz?.author && (
            <p className="text-sm text-brand-muted">by {quiz.author}</p>
          )}


          <div className="flex overflow-hidden rounded-2xl border border-brand-border bg-brand-card">
            {[
              { val: total,      label: "Questions" },
              { val: `${TIME_PER_Q}s`, label: "Per Question" },
              { val: "1",        label: "Correct Answer" },
            ].map((s, i) => (
              <div key={i} className={`flex flex-1 flex-col items-center py-5 ${i < 2 ? "border-r border-brand-border" : ""}`}>
                <span className="font-display text-3xl tracking-wider text-brand-lime">{s.val}</span>
                <span className="mt-1 text-xs font-semibold uppercase tracking-widest text-brand-muted">{s.label}</span>
              </div>
            ))}
          </div>


          <div className="rounded-xl border border-brand-border bg-brand-card p-5 flex flex-col gap-2.5">
            {[
              `⏱ Each question has a ${TIME_PER_Q}-second timer`,
              "✓ Select the correct answer before time runs out",
              "📊 Review your answers and score at the end",
            ].map((rule, i) => (
              <p key={i} className="text-sm text-brand-muted">{rule}</p>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={startQuiz}
              className="rounded-xl bg-brand-lime px-7 py-3.5 text-base font-bold text-[#0a1000] transition-all hover:-translate-y-0.5 hover:shadow-lime"
            >
              Start Quiz →
            </button>
            <button
              onClick={() => navigate(`/quiz/${quizId}`)}
              className="rounded-xl border border-brand-borderHi px-6 py-3.5 text-base font-semibold text-brand-muted transition-all hover:border-brand-muted hover:text-brand-text"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    );
  }


  if (step === "results") {
    const grade =
      pct >= 80 ? { label: "Excellent!", emoji: "🏆", color: "text-brand-lime" } :
      pct >= 60 ? { label: "Good Job!",  emoji: "🎯", color: "text-brand-blue" } :
      pct >= 40 ? { label: "Keep Trying",emoji: "💪", color: "text-brand-purple" } :
                  { label: "Need Practice", emoji: "📚", color: "text-brand-red" };

    const conic = `conic-gradient(#B8FF2E 0% ${pct}%, #1A1A2E ${pct}% 100%)`;

    return (
      <div className="flex min-h-screen flex-col items-center justify-start bg-brand-bg px-6 py-16 overflow-y-auto">
        <div className="w-full max-w-xl animate-fade-up flex flex-col items-center gap-6">
          <div className="text-6xl">{grade.emoji}</div>
          <h1 className={`font-display text-5xl tracking-widest ${grade.color}`}>{grade.label}</h1>
          <p className="text-sm text-brand-muted">{quiz?.title}</p>


          <div
            className="flex h-40 w-40 items-center justify-center rounded-full"
            style={{ background: conic }}
          >
            <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-brand-card">
              <span className="font-display text-4xl leading-none tracking-wide text-brand-lime">{score}</span>
              <span className="text-xs text-brand-muted">/ {total}</span>
              <span className="font-mono text-xs text-brand-muted">{pct}%</span>
            </div>
          </div>


          <div className="w-full rounded-2xl border border-brand-border bg-brand-card p-6">
            <h3 className="mb-4 font-display text-2xl tracking-widest text-brand-text">Review</h3>
            <div className="flex flex-col gap-2.5">
              {questions.map((q, i) => {
                const correct = answers[i]?.correct;
                const correctAns = q.answers.find((a) => a.is_right)?.answer || "—";
                return (
                  <div
                    key={q.id}
                    className={`flex gap-3 rounded-xl p-3 ${correct ? "bg-brand-lime/5" : "bg-brand-red/5"}`}
                  >
                    <span className={`mt-0.5 flex-shrink-0 text-sm font-bold ${correct ? "text-brand-lime" : "text-brand-red"}`}>
                      {correct ? "✓" : "✕"}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-brand-text">{q.title}</p>
                      <p className="mt-0.5 text-xs text-brand-muted">
                        {correct ? "Correct!" : `Correct: ${correctAns}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={startQuiz}
              className="rounded-xl bg-brand-lime px-7 py-3 text-base font-bold text-[#0a1000] transition-all hover:shadow-lime"
            >
              ↺ Play Again
            </button>
            <Link
              to="/"
              className="rounded-xl border border-brand-borderHi px-6 py-3 text-base font-semibold text-brand-muted transition-all hover:border-brand-muted hover:text-brand-text"
            >
              ← All Quizzes
            </Link>
          </div>
        </div>
      </div>
    );
  }


  const q         = questions[current];
  const timerPct  = (timeLeft / TIME_PER_Q) * 100;
  const timerColor =
    timeLeft > 10 ? "bg-brand-lime" :
    timeLeft > 5  ? "bg-yellow-400" : "bg-brand-red";
  const timerText =
    timeLeft > 10 ? "text-brand-lime" :
    timeLeft > 5  ? "text-yellow-400" : "text-brand-red";

  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">


      <div className="flex items-center justify-between border-b border-brand-border bg-brand-bg/90 px-6 py-3.5 backdrop-blur-md">
        <span className="font-mono text-xs text-brand-muted">{current + 1} / {total}</span>
        <span className="font-display text-lg tracking-widest text-brand-text hidden sm:block truncate max-w-xs">
          {quiz?.title}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-brand-limeDim px-3 py-1 text-xs font-semibold text-brand-lime">
          {score} correct
        </span>
      </div>


      <div className="h-0.5 w-full bg-brand-border">
        <div
          className="h-full bg-brand-blue transition-all duration-500"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>


      <div className="flex items-center gap-3 border-b border-brand-border px-6 py-2.5">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-brand-border">
          <div className={`timer-bar h-full rounded-full ${timerColor}`} style={{ width: `${timerPct}%` }} />
        </div>
        <span className={`font-mono text-sm font-medium ${timerText}`}>{timeLeft}s</span>
      </div>


      <div key={current} className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-10 animate-fade-up">
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-brand-muted">
            Question {current + 1}
          </p>
          <h2 className="text-2xl font-semibold leading-snug text-brand-text md:text-3xl">
            {q.title}
          </h2>
        </div>


        <div className="grid gap-3 sm:grid-cols-2">
          {q.answers.map((ans, i) => {
            let cls = "border-brand-border bg-brand-card text-brand-text hover:-translate-y-0.5 hover:border-brand-blue hover:bg-brand-blueDim hover:shadow-blue";
            if (answered) {
              if (ans.is_right)        cls = "border-brand-lime bg-brand-lime/8 text-brand-lime";
              else if (ans.id === selected) cls = "border-brand-red bg-brand-red/8 text-brand-red";
              else                     cls = "border-brand-border bg-brand-card opacity-35";
            }

            return (
              <button
                key={ans.id || i}
                disabled={answered}
                onClick={() => handleAnswer(ans.id)}
                className={`flex items-center gap-4 rounded-xl border px-5 py-4 text-left text-sm font-medium transition-all duration-150 disabled:cursor-default ${cls}`}
              >
                <span
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold ${
                    answered && ans.is_right
                      ? "bg-brand-lime text-[#0a1000]"
                      : answered && ans.id === selected && !ans.is_right
                      ? "bg-brand-red text-white"
                      : "bg-brand-border text-brand-muted"
                  }`}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1">{ans.answer}</span>
                {answered && ans.is_right && (
                  <span className="rounded-full bg-brand-limeDim px-2 py-0.5 text-xs font-bold text-brand-lime">✓</span>
                )}
                {answered && ans.id === selected && !ans.is_right && (
                  <span className="rounded-full bg-brand-redDim px-2 py-0.5 text-xs font-bold text-brand-red">✕</span>
                )}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="animate-fade-up flex flex-wrap items-center justify-between gap-4">
            <p className={`text-xl font-semibold ${answers[answers.length - 1]?.correct ? "text-brand-lime" : "text-brand-red"}`}>
              {answers[answers.length - 1]?.correct ? "🎉 Correct!" : "😅 Not quite!"}
            </p>
            <button
              onClick={nextQuestion}
              className="rounded-xl bg-brand-lime px-7 py-3 text-sm font-bold text-[#0a1000] transition-all hover:-translate-y-0.5 hover:shadow-lime"
            >
              {current + 1 >= total ? "See Results →" : "Next Question →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}