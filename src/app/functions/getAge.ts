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
