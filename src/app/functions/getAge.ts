import { Age } from '../interfaces/age';
import { FirestoreAge } from '../interfaces/firestore-age';

export function getAge(birthDate: Date): Age {
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

  return { year: y, month: m, day: d } as Age;
}

export function ageToText(age: Age, rounded: boolean = false): string {
  const { year, month, day } = age;

  if (rounded) {
    if (year) return `${year} year${year > 0 ? 's' : ''} old`;
    if (month) return `${month} month${month > 0 ? 's' : ''} old`;
    if (day) return `${day} day${day > 0 ? 's' : ''} old`;
  }
  return '';
}

export function ageToFirestoreAge(age: Age): FirestoreAge {
  if (age.year) return { age: age.year, unit: 'year' };
  else if (age.month) return { age: age.month, unit: 'month' };
  else return { age: age.day, unit: 'day' };
}
