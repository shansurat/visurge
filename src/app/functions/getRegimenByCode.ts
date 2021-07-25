import { regimens } from '../constants/regimens';
import { Regimen } from '../interfaces/regimen';

export function getRegimenByCode(code: string) {
  return (
    code ? regimens.find((regimen) => regimen.code == code) : null
  ) as Regimen;
}
