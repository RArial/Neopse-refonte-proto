const longFormatter = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
const shortFormatter = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

const DAY_MS = 24 * 60 * 60 * 1000;

/** AAAA-MM-JJ en heure locale (et non UTC, qui décalerait d'un jour le soir). */
export function toIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function todayIso(): string {
  return toIsoDate(new Date());
}

export function addDaysIso(iso: string, days: number): string {
  const date = parseIsoDate(iso);
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}

function parseIsoDate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/** « 22 juillet 2026 » */
export function formatLongDate(iso: string): string {
  return longFormatter.format(parseIsoDate(iso));
}

/** « 22/07/2026 » */
export function formatShortDate(iso: string): string {
  return shortFormatter.format(parseIsoDate(iso));
}

/** « aujourd'hui », « demain », « hier », « dans 3 jours », « il y a 96 jours ». */
export function formatRelativeDay(iso: string, today: string): string {
  // Arrondi : un changement d'heure (23 h ou 25 h) ne doit pas fausser le décompte.
  const diff = Math.round((parseIsoDate(iso).getTime() - parseIsoDate(today).getTime()) / DAY_MS);
  if (diff === 0) return "aujourd'hui";
  if (diff === 1) return 'demain';
  if (diff === -1) return 'hier';
  return diff > 0 ? `dans ${diff} jours` : `il y a ${-diff} jours`;
}
