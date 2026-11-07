export type Message = { role: 'user' | 'assistant'; content: string };

export function addUserMessage(messages: Message[], text: string): Message[] {
  // TODO: complete this step.
  return [...messages];
}
