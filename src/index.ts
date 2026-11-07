type Reply = { ok: boolean; status: number; json: () => Promise<unknown> };

function hasText(body: unknown): body is { text: string } {
  return typeof body === 'object' && body !== null && 'text' in body && typeof body.text === 'string';
}

export async function handleReply(fetchReply: () => Promise<Reply>): Promise<string> {
  const response = await fetchReply();
  if (!response.ok) throw new Error('HTTP ' + response.status);
  const body = await response.json();
  if (!hasText(body)) throw new Error('Response has no text');
  return body.text;
}
