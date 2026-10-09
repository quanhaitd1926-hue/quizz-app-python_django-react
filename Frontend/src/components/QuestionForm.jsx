import { useState, useEffect } from "react";

const emptyAnswer = () => ({ answer: "", is_right: false });

export default function QuestionForm({ initial, onSave, onClose, loading }) {
  const [title,   setTitle]   = useState(initial?.title   || "");
  const [answers, setAnswers] = useState(
    initial?.answers?.length ? initial.answers : [emptyAnswer(), emptyAnswer()]
  );

  useEffect(() => {
    if (initial) {
      setTitle(initial.title || "");
      setAnswers(initial.answers?.length ? initial.answers : [emptyAnswer(), emptyAnswer()]);
    }
  }, [initial]);

  const setField = (i, field, val) =>
    setAnswers((prev) => prev.map((a, idx) => idx === i ? { ...a, [field]: val } : a));
  const markCorrect = (i) =>
    setAnswers((prev) => prev.map((a, idx) => ({ ...a, is_right: idx === i })));
  const addAnswer = () => setAnswers((p) => [...p, emptyAnswer()]);
  const removeAnswer = (i) => setAnswers((p) => p.filter((_, idx) => idx !== i));

  const hasCorrect = answers.some((a) => a.is_right);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !hasCorrect) return;
    onSave({ title: title.trim(), answers: answers.filter((a) => a.answer.trim()) });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg animate-fade-up overflow-y-auto rounded-2xl border border-brand-borderHi bg-brand-card p-8 shadow-card"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-7 font-display text-4xl tracking-widest text-brand-text">
          {initial ? "Edit Question" : "New Question"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
              Question *
            </label>
            <input
              autoFocus
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your question…"
              className="w-full rounded-xl border border-brand-border bg-brand-input px-4 py-3 text-sm text-brand-text placeholder-brand-muted/60 outline-none transition-all focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
            />
          </div>


          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
                Answer Options
              </label>
              <span className="text-xs text-brand-muted">Click ● to mark correct</span>
            </div>

            {answers.map((ans, i) => (
              <div key={i} className="flex items-center gap-2">

                <button
                  type="button"
                  onClick={() => markCorrect(i)}
                  title="Mark as correct"
                  className={`h-5 w-5 flex-shrink-0 rounded-full border-2 transition-all ${
                    ans.is_right
                      ? "border-brand-lime bg-brand-lime"
                      : "border-brand-borderHi bg-transparent hover:border-brand-lime"
                  }`}
                />
                <input
                  value={ans.answer}
                  onChange={(e) => setField(i, "answer", e.target.value)}
                  placeholder={`Option ${i + 1}`}
                  className={`flex-1 rounded-xl border px-4 py-2.5 text-sm text-brand-text placeholder-brand-muted/50 outline-none transition-all focus:ring-2 ${
                    ans.is_right
                      ? "border-brand-limeDim bg-brand-lime/5 focus:border-brand-lime focus:ring-brand-lime/20"
                      : "border-brand-border bg-brand-input focus:border-brand-blue focus:ring-brand-blue/20"
                  }`}
                />
                {answers.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeAnswer(i)}
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-brand-redDim bg-brand-redDim text-brand-red text-xs transition-all hover:bg-brand-red hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            {answers.length < 6 && (
              <button
                type="button"
                onClick={addAnswer}
                className="mt-1 self-start rounded-xl border border-brand-borderHi bg-transparent px-4 py-2 text-xs font-semibold text-brand-muted transition-all hover:border-brand-muted hover:text-brand-text"
              >
                + Add Option
              </button>
            )}

            {!hasCorrect && (
              <p className="text-xs text-brand-red">⚠ Mark at least one answer as correct</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-brand-borderHi px-5 py-2.5 text-sm font-semibold text-brand-muted transition-all hover:border-brand-muted hover:text-brand-text"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim() || !hasCorrect}
              className="rounded-xl bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-blue disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? "Saving…" : initial ? "Save Changes" : "Add Question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}