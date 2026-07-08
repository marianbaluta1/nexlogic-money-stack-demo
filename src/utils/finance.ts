export function calculateHealth(income: number, expense: number) {
  const ratio = expense / income;

  if (ratio < 0.5) {
    return {
      label: "Strong",
      color: "bg-emerald-500/20 text-emerald-300",
    };
  }

  if (ratio < 0.8) {
    return {
      label: "Stable",
      color: "bg-blue-500/20 text-blue-300",
    };
  }

  return {
    label: "Risk",
    color: "bg-red-500/20 text-red-300",
  };
}