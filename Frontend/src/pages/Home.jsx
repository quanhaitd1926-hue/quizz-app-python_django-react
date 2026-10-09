import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getQuizzes, deleteQuiz } from "../api";
import { useToast } from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";

export default function Home() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch] = useState("");
  const [deleting, setDeleting] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    getQuizzes()
      .then(setQuizzes)
      .catch(() => toast("Failed to load quizzes", "error"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    try {
      await deleteQuiz(deleting.id);
      setQuizzes((q) => q.filter((x) => x.id !== deleting.id));
      toast("Quiz deleted");
    } catch {
      toast("Delete failed", "error");
    } finally {
      setDeleting(null);
    }
  };

  const filtered = quizzes.filter((q) =>
    q.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalQuestions = quizzes.reduce((s, q) => s + (q.question_count || 0), 0);
  const readyCount = quizzes.filter((q) => (q.question_count || 0) > 0).length;

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24">

      <div className="relative py-20 animate-fade-up">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(#1A1A2E 1px, transparent 1px), linear-gradient(90deg, #1A1A2E 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse at 80% 50%, black 10%, transparent 65%)",
          }}
        />

        <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-brand-limeDim bg-brand-limeDim/50 px-3 py-1 text-xs font-semibold text-brand-lime">
          ⚡ Quiz Platform
        </span>

        <h1 className="mt-3 font-display text-7xl leading-none tracking-wide text-brand-text md:text-8xl">
          Build &amp; Play
          <br />
          <span
            className="font-display"
            style={{ WebkitTextStroke: "2px #B8FF2E", color: "transparent" }}
          >
            Knowledge Games
          </span>
        </h1>

        <p className="mt-5 max-w-md text-brand-muted">
          Create interactive quizzes, challenge yourself, and track your knowledge. All in one place.
        </p>

        <Link
          to="/create"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-lime px-7 py-3.5 text-base font-bold text-[#0a1000] transition-all hover:-translate-y-0.5 hover:shadow-lime"
        >
          Create New Quiz →
        </Link>
      </div>

      {!loading && quizzes.length > 0 && (
        <div className="mb-12 flex overflow-hidden rounded-2xl border border-brand-border bg-brand-card animate-fade-up delay-100">
          {[
            { val: quizzes.length, label: "Total Quizzes" },
            { val: totalQuestions, label: "Total Questions" },
            { val: readyCount,     label: "Ready to Play" },
          ].map((s, i) => (
            <div
              key={i}
              className={`flex flex-1 flex-col items-center justify-center py-5 ${
                i < 2 ? "border-r border-brand-border" : ""
              }`}
            >
              <span className="font-display text-4xl leading-none tracking-wide text-brand-lime">
                {s.val}
              </span>
              <span className="mt-1 text-xs font-semibold uppercase tracking-widest text-brand-muted">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="mb-6 flex items-center justify-between gap-4 animate-fade-up delay-150">
        <h2 className="font-display text-4xl tracking-wide text-brand-text">All Quizzes</h2>
        {quizzes.length > 3 && (
          <input
            className="w-64 rounded-xl border border-brand-border bg-brand-input px-4 py-2.5 text-sm text-brand-text placeholder-brand-muted/60 outline-none transition-all focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
            placeholder="Search quizzes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="h-9 w-9 animate-spin-slow rounded-full border-4 border-brand-border border-t-brand-blue" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center">
          <div className="mb-4 text-5xl opacity-40">📋</div>
          <h3 className="mb-2 font-display text-3xl tracking-wide text-brand-text opacity-60">
            {search ? "No Results Found" : "No Quizzes Yet"}
          </h3>
          <p className="mb-6 text-sm text-brand-muted">
            {search ? "Try a different search term." : "Create your first quiz to get started!"}
          </p>
          {!search && (
            <Link to="/create" className="rounded-xl bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition-all hover:shadow-blue">
              Create Quiz
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((quiz, i) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              delay={i * 50}
              onDelete={() => setDeleting(quiz)}
              onManage={() => navigate(`/quiz/${quiz.id}`)}
              onPlay={()   => navigate(`/quiz/${quiz.id}/play`)}
            />
          ))}
        </div>
      )}

      {deleting && (
        <ConfirmModal
          message={`Delete "${deleting.title}"? All questions will be removed.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}

function QuizCard({ quiz, delay, onDelete, onManage, onPlay }) {
  const ready = (quiz.question_count || 0) > 0;
  return (
    <div
      className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-brand-border bg-brand-card p-6 transition-all duration-200 hover:-translate-y-1 hover:border-brand-borderHi hover:shadow-card animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-brand-blue to-brand-purple opacity-0 transition-opacity group-hover:opacity-100" />

      <span className="font-mono text-xs text-brand-muted">
        #{String(quiz.id).padStart(3, "0")}
      </span>

      <h3 className="font-display text-2xl leading-tight tracking-wide text-brand-text">
        {quiz.title}
      </h3>

      {quiz.author && (
        <p className="text-xs text-brand-muted">by {quiz.author}</p>
      )}

      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-brand-blueDim px-3 py-1 text-xs font-semibold text-brand-blue">
          📝 {quiz.question_count || 0} Q{quiz.question_count !== 1 ? "s" : ""}
        </span>
        {ready ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-limeDim px-3 py-1 text-xs font-semibold text-brand-lime">
            ● Ready
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-border px-3 py-1 text-xs font-semibold text-brand-muted">
            ○ Draft
          </span>
        )}
      </div>

      <div className="mt-auto flex items-center gap-2 pt-2">
        <button
          onClick={onManage}
          className="rounded-lg border border-brand-borderHi px-3 py-1.5 text-xs font-semibold text-brand-muted transition-all hover:border-brand-muted hover:text-brand-text"
        >
          ⚙ Manage
        </button>
        {ready && (
          <button
            onClick={onPlay}
            className="rounded-lg bg-brand-blue px-3 py-1.5 text-xs font-semibold text-white transition-all hover:shadow-blue"
          >
            ▶ Play
          </button>
        )}
        <button
          onClick={onDelete}
          className="ml-auto rounded-lg border border-brand-redDim bg-brand-redDim p-1.5 text-xs text-brand-red transition-all hover:bg-brand-red hover:text-white"
          title="Delete"
        >
          🗑
        </button>
      </div>
    </div>
  );
}