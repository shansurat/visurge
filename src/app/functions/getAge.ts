interface Age {
  years?: number;
  months?: number;
  days?: number;
}

export function getAge(birthDate: Date) {
  let today = new Date();
  let y = today.getFullYear() - birthDate.getFullYear();
  let m = today.getMonth() - birthDate.getMonth();
  let d = today.getDate() - birthDate.getDate();

  if (d < 0) {
    d += new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    m--;
  }

  if (m < 0) {
    m += 12;
    y--;
  }

  if (m === 0 && today.getDate() < birthDate.getDate()) y--;

  return { years: y, months: m, days: d };
}

export function ageToText(age: Age, rounded: boolean = false): string {
  const { years, months, days } = age;

  if (rounded) {
    if (years) return `${years} year${years > 0 ? 's' : ''} old`;
    if (months) return `${years} month${months > 0 ? 's' : ''} old`;
    if (days) return `${years} day${days > 0 ? 's' : ''} old`;
  } else {
  }
  return '';
}
