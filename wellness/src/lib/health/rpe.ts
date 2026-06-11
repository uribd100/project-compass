// Heart-rate context helpers. NOTE: for this user, RPE governs intensity (beta-blocker).
// HR figures below are informational only and are intentionally de-emphasised in the UI.

export function estimatedMaxHr(age: number): number {
  return 220 - age;
}

// Karvonen (HR reserve) — shown only as a rough reference, never as a hard target.
export function hrReserveZone(age: number, restingHr: number, lowPct: number, highPct: number) {
  const max = estimatedMaxHr(age);
  const reserve = max - restingHr;
  return {
    low: Math.round(restingHr + reserve * lowPct),
    high: Math.round(restingHr + reserve * highPct),
  };
}

export function moneySaved(joints: number, costPerJoint: number, days: number): number {
  return joints * costPerJoint * days;
}
