type Usage = { input: number; output: number };

export function estimateCost(usage?: Usage): number | null {
  if (usage === undefined) return null;
  return usage.input + 2 * usage.output;
}
