type Message = { role: 'user' | 'assistant'; content: string };
type Ask = (messages: Message[]) => Promise<string>;

export function createSession(ask: Ask) {
  let history: Message[] = [];
  return {
    async send(text: string): Promise<string> {
      const next: Message = { role: 'user', content: text };
      const answer = await ask([...history, next]);
      history = [...history, next, { role: 'assistant', content: answer }];
      return answer;
    },
    reset(): void {
      history = [];
    },
  };
}
