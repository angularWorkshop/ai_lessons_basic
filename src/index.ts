export async function describeStatus(lookup: () => Promise<string>): Promise<string> {
  const status = await lookup();
  return 'Status: ' + String(status);
}
