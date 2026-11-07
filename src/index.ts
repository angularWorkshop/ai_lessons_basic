export function ticketState(title?: string): 'ready' | 'needs-input' {
  if (title === undefined || title.trim() === '') {
    return 'needs-input';
  }
  return 'ready';
}
