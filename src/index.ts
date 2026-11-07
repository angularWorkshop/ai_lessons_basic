export function ticketState(title?: string): 'ready' | 'needs-input' {
  // TODO: complete this step.
  if (title === undefined) {
    return 'needs-input';
  }
  return 'ready';
}
