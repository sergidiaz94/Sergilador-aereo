// Calcula la data del diumenge següent a partir d'una data ISO (YYYY-MM-DD).
export function getDefaultReturnDate(fromDateISO: string): string {
  const date = new Date(fromDateISO);
  const day = date.getDay();
  const daysUntilSunday = (7 - day) % 7 || 7;
  date.setDate(date.getDate() + daysUntilSunday);
  return date.toISOString().split('T')[0];
}
