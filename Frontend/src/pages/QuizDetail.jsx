import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getQuiz, getQuestions, createQuestion, updateQuestion, deleteQuestion } from "../api";
import { useToast } from "../components/Toast";
import QuestionForm from "../components/QuestionForm";
import ConfirmModal from "../components/ConfirmModal";

export default function QuizDetail() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    Promise.all([getQuiz(quizId), getQuestions(quizId)])
      .then(([q, qs]) => { setQuiz(q); setQuestions(qs); })
      .catch(() => toast("Failed to load quiz", "error"))
      .finally(() => setLoading(false));
  }, [quizId]);

  const openCreate = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (q) => { setEditing(q); setFormOpen(true); };
  const closeForm = () => { setFormOpen(false); setEditing(null); };

  const handleSave = async (data) => {
    setSaving(true);
    try {
      if (editing) {
        const updated = await updateQuestion(editing.id, data);
        setQuestions((qs) => qs.map((q) => q.id === editing.id ? updated : q));
        toast("Question updated!");
      } else {
        const created = await createQuestion(quizId, data);
        setQuestions((qs) => [...qs, created]);
        toast("Question added!");
      }
      closeForm();
    } catch {
      toast("Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteQuestion(deleting.id);
      setQuestions((qs) => qs.filter((q) => q.id !== deleting.id));
      toast("Question deleted");
    } catch {
      toast("Delete failed", "error");
    } finally {
      setDeleting(null);
    }
  };

  const toggle = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-9 w-9 animate-spin-slow rounded-full border-4 border-brand-border border-t-brand-blue" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-24 text-center">
        <div className="mb-4 text-5xl">❌</div>
        <h3 className="mb-6 font-display text-4xl tracking-wide text-brand-text opacity-60">Quiz Not Found</h3>
        <Link to="/" className="rounded-xl bg-brand-blue px-6 py-3 text-sm font-semibold text-white">← Back Home</Link>
      </div>
    );
  }

  const readyToPlay = questions.length > 0;

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24">


      <div className="animate-fade-up pt-10">
        <button
          onClick={() => navigate("/")}
          className="mb-5 rounded-xl border border-brand-borderHi px-4 py-2 text-xs font-semibold text-brand-muted transition-all hover:border-brand-muted hover:text-brand-text"
        >
          ← All Quizzes
        </button>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-1.5 font-mono text-xs text-brand-muted">
              #{String(quiz.id).padStart(3, "0")} · by {quiz.author || "Unknown"}
            </p>
            <h1 className="font-display text-5xl leading-none tracking-wide text-brand-text md:text-6xl">
              {quiz.title}
            </h1>
          </div>

          <div className="flex flex-shrink-0 items-center gap-3">
            <Link
              to={`/quiz/${quizId}/edit`}
              className="rounded-xl border border-brand-borderHi px-4 py-2.5 text-sm font-semibold text-brand-muted transition-all hover:border-brand-muted hover:text-brand-text"
            >
              ✏ Edit
            </Link>
            {readyToPlay && (
              <Link
                to={`/quiz/${quizId}/play`}
                className="rounded-xl bg-brand-lime px-5 py-2.5 text-sm font-bold text-[#0a1000] transition-all hover:-translate-y-0.5 hover:shadow-lime"
              >
                ▶ Play Quiz
              </Link>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-blueDim px-3 py-1 text-xs font-semibold text-brand-blue">
            📝 {questions.length} question{questions.length !== 1 ? "s" : ""}
          </span>
          {readyToPlay ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-limeDim px-3 py-1 text-xs font-semibold text-brand-lime">
              ● Ready to Play
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-border px-3 py-1 text-xs font-semibold text-brand-muted">
              ○ Add questions to play
            </span>
          )}
        </div>
      </div>


      <div className="my-8 h-px bg-brand-border" />


      <div className="animate-fade-up delay-100">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-3xl tracking-wide text-brand-text">Questions</h2>
          <button
            onClick={openCreate}
            className="rounded-xl bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-blue"
          >
            + Add Question
          </button>
        </div>

        {questions.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mb-4 text-5xl opacity-40">❓</div>
            <h3 className="mb-2 font-display text-3xl tracking-wide text-brand-text opacity-60">No Questions Yet</h3>
            <p className="mb-6 text-sm text-brand-muted">Add your first question to get started.</p>
            <button onClick={openCreate} className="rounded-xl bg-brand-blue px-6 py-3 text-sm font-semibold text-white hover:shadow-blue">
              Add First Question
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {questions.map((q, i) => (
              <QuestionItem
                key={q.id}
                question={q}
                index={i}
                expanded={!!expanded[q.id]}
                onToggle={() => toggle(q.id)}
                onEdit={() => openEdit(q)}
                onDelete={() => setDeleting(q)}
              />
            ))}
          </div>
        )}
      </div>

      {formOpen && <QuestionForm initial={editing} onSave={handleSave} onClose={closeForm} loading={saving} />}
      {deleting && (
        <ConfirmModal
          message={`Delete "${deleting.title}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}

function QuestionItem({ question, index, expanded, onToggle, onEdit, onDelete }) {
  const correctCount = question.answers?.filter((a) => a.is_right).length || 0;

  return (
    <div className={`overflow-hidden rounded-xl border transition-colors ${expanded ? "border-brand-borderHi" : "border-brand-border"} bg-brand-card`}>

      <div
        className="flex cursor-pointer select-none items-center justify-between px-5 py-4 hover:bg-white/[0.02]"
        onClick={onToggle}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex-shrink-0 rounded-md bg-brand-blueDim px-2 py-1 font-mono text-xs font-medium text-brand-blue">
            Q{index + 1}
          </span>
          <span className="truncate text-sm font-medium text-brand-text">{question.title}</span>
        </div>
        <div className="ml-3 flex flex-shrink-0 items-center gap-2">
          <span className="rounded-full bg-brand-blueDim px-2.5 py-0.5 text-xs font-semibold text-brand-blue">
            {question.answers?.length || 0} opts
          </span>
          <span className="rounded-full bg-brand-limeDim px-2.5 py-0.5 text-xs font-semibold text-brand-lime">
            {correctCount} ✓
          </span>
          <span className="text-xs text-brand-muted">{expanded ? "▲" : "▼"}</span>
        </div>
      </div>


      {expanded && (
        <div className="animate-fade-in border-t border-brand-border px-5 py-4">
          <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {question.answers?.map((ans, i) => (
              <div
                key={ans.id || i}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                  ans.is_right
                    ? "border-brand-limeDim bg-brand-lime/5 font-medium text-brand-lime"
                    : "border-brand-border bg-brand-input text-brand-text"
                }`}
              >
                {ans.is_right && <span className="text-xs font-bold text-brand-lime">✓</span>}
                <span className="truncate">{ans.answer}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="rounded-lg border border-brand-borderHi px-4 py-1.5 text-xs font-semibold text-brand-muted transition-all hover:border-brand-muted hover:text-brand-text"
            >
              ✏ Edit
            </button>
            <button
              onClick={onDelete}
              className="rounded-lg border border-brand-redDim bg-brand-redDim px-4 py-1.5 text-xs font-semibold text-brand-red transition-all hover:bg-brand-red hover:text-white"
            >
              🗑 Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}