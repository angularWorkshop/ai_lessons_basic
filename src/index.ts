export function readSettings(values: Record<string, string | undefined>) {
  const baseUrl = values.LLM_BASE_URL?.trim();
  const model = values.LLM_MODEL?.trim();
  if (!baseUrl) throw new Error('Missing LLM_BASE_URL');
  if (!model) throw new Error('Missing LLM_MODEL');
  return { baseUrl, model };
}
