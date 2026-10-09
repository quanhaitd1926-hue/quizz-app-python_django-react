import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createQuiz, updateQuiz, getQuiz } from "../api";
import { useToast } from "../components/Toast";

export default function CreateQuiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const isEdit = !!quizId;

  const [form, setForm] = useState({ title: "", author: "" });
  const [loading,  setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!quizId) return;
    getQuiz(quizId)
      .then((q) => setForm({ title: q.title, author: q.author || "" }))
      .catch(() => toast("Failed to load quiz", "error"))
      .finally(() => setFetching(false));
  }, [quizId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      if (isEdit) {
        await updateQuiz(quizId, form);
        toast("Quiz updated!");
        navigate(`/quiz/${quizId}`);
      } else {
        const quiz = await createQuiz(form);
        toast("Quiz created!");
        navigate(`/quiz/${quiz.id}`);
      }
    } catch {
      toast(isEdit ? "Update failed" : "Create failed", "error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-9 w-9 animate-spin-slow rounded-full border-4 border-brand-border border-t-brand-blue" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-12">
      <div className="grid gap-10 lg:grid-cols-[1fr_280px]">

        <div className="animate-fade-up flex flex-col gap-6">
          <button
            onClick={() => navigate(isEdit ? `/quiz/${quizId}` : "/")}
            className="self-start rounded-xl border border-brand-borderHi px-4 py-2 text-xs font-semibold text-brand-muted transition-all hover:border-brand-muted hover:text-brand-text"
          >
            ← Back
          </button>

          <div>
            <h1 className="font-display text-6xl leading-none tracking-wide text-brand-text">
              {isEdit ? "Edit Quiz" : "New Quiz"}
            </h1>
            <p className="mt-3 text-sm text-brand-muted">
              {isEdit
                ? "Update the quiz details below."
                : "Give your quiz a title and author, then add questions."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
                Quiz Title *
              </label>
              <input
                autoFocus
                required
                placeholder="e.g. World Capitals Trivia"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-xl border border-brand-border bg-brand-input px-5 py-3.5 text-base text-brand-text placeholder-brand-muted/60 outline-none transition-all focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
                Author
              </label>
              <input
                placeholder="Your name or team"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                className="w-full rounded-xl border border-brand-border bg-brand-input px-5 py-3 text-sm text-brand-text placeholder-brand-muted/60 outline-none transition-all focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(isEdit ? `/quiz/${quizId}` : "/")}
                className="rounded-xl border border-brand-borderHi px-5 py-3 text-sm font-semibold text-brand-muted transition-all hover:border-brand-muted hover:text-brand-text"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !form.title.trim()}
                className="rounded-xl bg-brand-lime px-7 py-3 text-sm font-bold text-[#0a1000] transition-all hover:-translate-y-0.5 hover:shadow-lime disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? "Saving…" : isEdit ? "Save Changes" : "Create & Add Questions →"}
              </button>
            </div>
          </form>
        </div>

        <div
          className="animate-fade-up delay-100 h-fit rounded-2xl border border-brand-border bg-brand-card p-7"
          style={{ position: "sticky", top: "88px" }}
        >
          <h3 className="mb-4 font-display text-2xl tracking-widest text-brand-text">
            💡 Tips
          </h3>
          <ul className="flex flex-col gap-3">
            {[
              "Keep titles short and descriptive",
              "After creating, add multiple questions",
              "Each question supports up to 6 options",
              "Mark one answer as correct per question",
              "Play mode has a 20-second timer per question",
            ].map((tip, i) => (
              <li key={i} className="flex gap-2 text-xs leading-relaxed text-brand-muted">
                <span className="mt-0.5 flex-shrink-0 text-brand-blue">→</span>
                {tip}
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t border-brand-border pt-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-muted">
              Example Titles
            </p>
            {['"Harry Potter Trivia"', '"Python Basics Quiz"', '"World Geography"'].map((ex, i) => (
              <p
                key={i}
                className="border-b border-brand-border py-2 text-xs italic text-brand-muted last:border-none"
              >
                {ex}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}