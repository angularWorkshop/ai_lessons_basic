export async function describeStatus(lookup: () => Promise<string>): Promise<string> {
  // TODO: complete this step.
  const status = lookup();
  return 'Status: ' + String(status);
}
