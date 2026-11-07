type Message = { role: 'system' | 'user'; content: string };

export function buildRequest(model: string, question: string): { model: string; messages: Message[] } {
  return {
    model,
    messages: [
      { role: 'system', content: 'Use only confirmed facts.' },
      // TODO: complete this step.
      // Include the user's message here.
    ],
  };
}
