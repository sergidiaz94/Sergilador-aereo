// Calcula la data del diumenge següent a partir d'una data ISO (YYYY-MM-DD).
// Formata una data ISO com DD-MM-AAAA (format català habitual).
export function formatDisplayDate(iso: string): string {
  if (!iso) return '';
  const datePart = iso.split('T')[0];
  const [y, m, d] = datePart.split('-');
  if (!y || !m || !d) return iso;
  return `${d}-${m}-${y}`;
}

// Formata una data ISO com DD-MM-AAAA HH:MM.
export function formatDisplayDateTime(iso: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

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

const CATALAN_MONTHS_SHORT = [
  'gen', 'feb', 'març', 'abr', 'maig', 'juny', 'jul', 'ag', 'set', 'oct', 'nov', 'des',
];

function formatDayMonth(iso: string): string {
  const date = new Date(iso);
  return `${date.getDate()} ${CATALAN_MONTHS_SHORT[date.getMonth()]}`;
}

export type WeekendOption = { friday: string; sunday: string; label: string };

// Genera els propers `count` caps de setmana (divendres-diumenge) a partir
// del proper, per poder triar-ne un altre que no sigui el més immediat.
export function getUpcomingWeekends(count = 6): WeekendOption[] {
  const first = getNextWeekend();
  const weekends: WeekendOption[] = [];

  for (let i = 0; i < count; i += 1) {
    const friday = new Date(first.friday);
    friday.setDate(friday.getDate() + i * 7);
    const sunday = new Date(friday);
    sunday.setDate(friday.getDate() + 2);

    const fridayISO = friday.toISOString().split('T')[0];
    const sundayISO = sunday.toISOString().split('T')[0];

    weekends.push({
      friday: fridayISO,
      sunday: sundayISO,
      label: `${formatDayMonth(fridayISO)} - ${formatDayMonth(sundayISO)}`,
    });
  }

  return weekends;
}
