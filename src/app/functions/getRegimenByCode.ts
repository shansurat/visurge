import { regimens } from '../constants/regimens';
import { Regimen } from '../interfaces/regimen';

export function getRegimenByCode(code: string) {
  return regimens.find((regimen) => regimen.code == code) as Regimen;
}
