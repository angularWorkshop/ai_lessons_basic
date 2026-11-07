type Usage = { input: number; output: number };

export function estimateCost(usage?: Usage): number | null {
  if (usage === undefined) return null;
  // TODO: complete this step.
  return usage.input + usage.output;
}
