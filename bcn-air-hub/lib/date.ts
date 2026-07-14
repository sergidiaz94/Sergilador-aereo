// Calcula la data del diumenge següent a partir d'una data ISO (YYYY-MM-DD).
export function getDefaultReturnDate(fromDateISO: string): string {
  const date = new Date(fromDateISO);
  const day = date.getDay();
  const daysUntilSunday = (7 - day) % 7 || 7;
  date.setDate(date.getDate() + daysUntilSunday);
  return date.toISOString().split('T')[0];
}

// Calcula el proper divendres i diumenge (per a les ofertes de cap de
// setmana). Si avui ja és divendres a partir de les 18h, dissabte o
// diumenge, salta a la setmana següent.
export function getNextWeekend(): { friday: string; sunday: string } {
  const now = new Date();
  const day = now.getDay(); // 0=Diumenge ... 5=Divendres, 6=Dissabte

  let daysUntilFriday = (5 - day + 7) % 7;

  if (day === 5 && now.getHours() >= 18) {
    daysUntilFriday = 7;
  } else if (day === 6) {
    daysUntilFriday = 6;
  } else if (day === 0) {
    daysUntilFriday = 5;
  }

  const friday = new Date(now);
  friday.setDate(now.getDate() + daysUntilFriday);
  friday.setHours(18, 0, 0, 0);

  const sunday = new Date(friday);
  sunday.setDate(friday.getDate() + 2);

  const toISO = (date: Date) => date.toISOString().split('T')[0];

  return { friday: toISO(friday), sunday: toISO(sunday) };
}
