export function getCSSVariableNumber(varName: string): number {
  const style = getComputedStyle(document.documentElement);
  const value = style
    .getPropertyValue(varName)
    .replace(/[a-zA-Z]/g, "")
    .trim();

  return parseFloat(value);
}