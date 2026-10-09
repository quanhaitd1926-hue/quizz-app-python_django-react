const BASE_URL = "/api/v1/quiz";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(JSON.stringify(err) || `HTTP ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const getQuizzes = ()=> request("/");
export const getQuiz = (id)=> request(`/${id}/`);
export const createQuiz = (data)=> request("/", { method: "POST", body: JSON.stringify(data) });
export const updateQuiz = (id, data)=> request(`/${id}/`, { method: "PATCH", body: JSON.stringify(data) });
export const deleteQuiz = (id)=> request(`/${id}/`, { method: "DELETE" });

export const getQuestions = (qzId)=> request(`/questions/${qzId}/`);
export const createQuestion = (qzId, data)=> request(`/questions/${qzId}/`, { method: "POST",  body: JSON.stringify(data) });
export const updateQuestion = (pk, data)=> request(`/questions/detail/${pk}/`, { method: "PATCH", body: JSON.stringify(data) });
export const deleteQuestion = (pk)=> request(`/questions/detail/${pk}/`, { method: "DELETE" });