export type Message = { role: 'user' | 'assistant'; content: string };

export function addUserMessage(messages: Message[], text: string): Message[] {
  return [...messages, { role: 'user', content: text }];
}
