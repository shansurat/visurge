import { regimens } from '../constants/regimens';
import { EligibilityStatus } from '../interfaces/eligibility-status';
import { ViralLoadEntry } from '../interfaces/viral-load-entry';
import { diffDate } from './diffDate';
import { getAge } from './getAge';

const ELIGIBLE: EligibilityStatus = { eligible: true };
const INELIGIBLE: EligibilityStatus = { eligible: false };

const ELIGIBLE_CONSIDER_EAC: EligibilityStatus = {
  ...ELIGIBLE,
  note: 'consider-eac',
};
const INELIGIBLE_CHECK_EAC: EligibilityStatus = {
  ...INELIGIBLE,
  note: 'check-eac',
};

export function getEligibilityStatus(val: any): EligibilityStatus | null {
  let {
    ARTStartDate,
    age,
    hvl,
    pmtct,
    pmtctEnrollStartDate,
    regimen,
    regimenStartTransDate,
    eac3Completed,
    vlh,
  } = val;
  console.log(val);

  if (!(ARTStartDate && hvl && regimen && regimenStartTransDate)) return null;

  pmtct = pmtct == 'yes';
  eac3Completed = eac3Completed == 'yes';
  hvl = hvl == 'yes';

  const isAdult: boolean = Object.keys(age)[0] == 'years' && age.years >= 19;

  const regimenIsTLD =
    regimens.find((_regimen) => _regimen.code == regimen)?.category == 'TLD';
  const regimenIs2ndLine = regimens
    .find((_regimen) => _regimen.code == regimen)
    ?.ageCategory.includes('2');

  const today = new Date();
  const artDiff = diffDate(today, ARTStartDate);
  const regDiff = diffDate(today, regimenStartTransDate);
  const l = vlh?.length || 0;

  if (pmtct) {
    if (regDiff >= 0 && artDiff >= 0) {
      if (
        ARTStartDate == regimenStartTransDate &&
        regimenStartTransDate == pmtctEnrollStartDate
      ) {
        if (artDiff >= 90) {
          if (!hvl && !l) return ELIGIBLE;
        } else {
          if (hvl) {
            if (
              diffDate(vlh[0]?.dateSampleCollected, pmtctEnrollStartDate) >= 90
            )
              return eac3Completed ? ELIGIBLE : INELIGIBLE_CHECK_EAC;
          } else {
            if (l == 1) {
              if (
                diffDate(vlh[0]?.dateSampleCollected, pmtctEnrollStartDate) >=
                  90 &&
                !isHVL(vlh[0]?.value)
              )
                return ELIGIBLE;
            } else if (l == 2) {
              if (
                diffDate(
                  vlh[0]?.dateSampleCollected,
                  vlh[1]?.dateSampleCollected
                ) >= 180 &&
                diffDate(vlh[1]?.dateSampleCollected, pmtctEnrollStartDate) >=
                  180 &&
                !isHVL(vlh[0]?.value) &&
                !isHVL(vlh[0]?.value)
              )
                return ELIGIBLE;
            } else if (l >= 3) {
              if (
                diffDate(
                  vlh[0]?.dateSampleCollected,
                  vlh[1]?.dateSampleCollected
                ) >= 180 &&
                diffDate(
                  vlh[1]?.dateSampleCollected,
                  vlh[2]?.dateSampleCollected
                ) >= 180 &&
                diffDate(vlh[1]?.dateSampleCollected, pmtctEnrollStartDate) >=
                  180 &&
                !isHVL(vlh[0]?.value) &&
                !isHVL(vlh[0]?.value) &&
                !isHVL(vlh[0]?.value)
              )
                return ELIGIBLE;
            }
          }
        }
      }

      if (
        diffDate(pmtctEnrollStartDate, ARTStartDate) >= 0 &&
        diffDate(pmtctEnrollStartDate, regimenStartTransDate) >= 0
      ) {
        if (hvl) {
          if (diffDate(vlh[0]?.dateSampleCollected, pmtctEnrollStartDate) >= 0)
            return eac3Completed ? ELIGIBLE : INELIGIBLE_CHECK_EAC;
        } else {
          if (!l) {
            return ELIGIBLE;
          } else if (l == 1) {
            if (
              diffDate(vlh[0]?.dateSampleCollected, pmtctEnrollStartDate) < 0 ||
              diffDate(vlh[0]?.dateSampleCollected, pmtctEnrollStartDate) >= 180
            )
              return ELIGIBLE;
          } else if (l == 2) {
            if (
              diffDate(
                vlh[0]?.dateSampleCollected,
                vlh[1]?.dateSampleCollected
              ) >= 180 &&
              diffDate(vlh[1]?.dateSampleCollected, pmtctEnrollStartDate) >=
                180 &&
              !isHVL(vlh[0]?.value) &&
              !isHVL(vlh[0]?.value)
            ) {
              return ELIGIBLE;
            }
          } else if (l >= 3) {
            if (
              diffDate(
                vlh[0]?.dateSampleCollected,
                vlh[1]?.dateSampleCollected
              ) >= 180 &&
              diffDate(
                vlh[1]?.dateSampleCollected,
                vlh[2]?.dateSampleCollected
              ) >= 180 &&
              diffDate(vlh[2]?.dateSampleCollected, pmtctEnrollStartDate) >=
                180 &&
              !isHVL(vlh[0]?.value) &&
              !isHVL(vlh[0]?.value) &&
              !isHVL(vlh[0]?.value)
            ) {
              return ELIGIBLE;
            }
          }
        }
      }
    }
  } else {
    if (isAdult) {
      if (artDiff >= 180 && regDiff >= 180) {
        if (hvl) {
          console.log('im here');
          if (
            diffDate(vlh[0]?.dateSampleCollected, regimenStartTransDate) >= 180
          ) {
            return eac3Completed ? ELIGIBLE : INELIGIBLE_CHECK_EAC;
          }
        } else {
          return getVLStatus(vlh, regimenStartTransDate, ARTStartDate)
            ? ELIGIBLE
            : INELIGIBLE;
        }
      }
    } else {
      if (artDiff >= 180 && regDiff >= 180) {
        if (hvl) {
          if (
            diffDate(vlh[0]?.dateSampleCollected, regimenStartTransDate) >= 180
          )
            return eac3Completed ? ELIGIBLE : INELIGIBLE_CHECK_EAC;
        } else {
          if (
            !l ||
            (!isHVL(vlh[0]?.value) &&
              diffDate(vlh[0]?.dateSampleCollected, regimenStartTransDate))
          )
            return ELIGIBLE;
        }
      }
    }
  }

  console.log('INELIGIBLE');
  return INELIGIBLE;
}

export function getIITStatus(nextAppointmentDate: any) {
  const today = new Date();
  if (nextAppointmentDate) {
    let cvhDiffDate = diffDate(today, nextAppointmentDate) / 30;
    if (cvhDiffDate < 0) return 'active';
    else if (cvhDiffDate >= 0 && cvhDiffDate <= 1) return 'iit <= 1';
    else if (cvhDiffDate > 1 && cvhDiffDate <= 3) return 'iit <= 3';
    else return 'iit > 3';
  }
  return 'pending';
}

export function getNextVLDate(vlh: ViralLoadEntry[]): Date | null {
  if (vlh.length >= 2) {
    const vl1IsLow = vlh[0].undetectableViralLoad || vlh[0].value < 1000;
    const vl2IsLow = vlh[1].undetectableViralLoad || vlh[1].value < 1000;

    const vl1Date = vlh[0].dateSampleCollected;
    let nextVLDate = new Date();

    if (vl1IsLow && vl2IsLow) {
      nextVLDate.setDate(vl1Date.getDate() + 365);
      console.log(nextVLDate);
      return nextVLDate;
    }
  }

  return null;
}

export function getCountDown(vlh: any[]) {}

function getVLStatus(vlh: any[], regDate: Date, ARTDate: Date): boolean {
  const today = new Date();
  const regArtDiff = diffDate(regDate, ARTDate);
  const artDiff = diffDate(today, ARTDate);
  const regDiff = diffDate(today, regDate);
  const l = vlh?.length || 0;

  console.log(l);
  if (!l) {
    if (artDiff >= 180 && regDiff >= 180) return true;
  } else if (l == 1) {
    if (artDiff >= 360 && regDiff >= 360) {
      if (
        diffDate(vlh[0]?.dateSampleCollected, regDate) >= 180 &&
        !isHVL(vlh[1]?.value)
      )
        return true;
    }
  } else if (l == 2) {
    if (artDiff >= 720 && regDiff >= 720) {
      if (
        diffDate(vlh[0]?.dateSampleCollected, vlh[1]?.dateSampleCollected) >=
          180 &&
        diffDate(vlh[1]?.dateSampleCollected, regDate) >= 180 &&
        !isHVL(vlh[1]?.value) &&
        !isHVL(vlh[2]?.value)
      )
        return true;
    }
  } else if (l >= 3) {
    console.log(artDiff, regDiff);
    if (artDiff >= 1080 && regDiff >= 1080) {
      if (
        diffDate(vlh[0]?.dateSampleCollected, vlh[1]?.dateSampleCollected) >=
          360 &&
        diffDate(vlh[1]?.dateSampleCollected, vlh[2]?.dateSampleCollected) >=
          180 &&
        diffDate(vlh[2]?.dateSampleCollected, regDate) >= 180 &&
        !isHVL(vlh[0]?.value) &&
        !isHVL(vlh[1]?.value) &&
        !isHVL(vlh[2]?.value)
      )
        return true;
    }
  }
  return false;
}

function isHVL(vl?: number) {
  return vl ? vl >= 1000 : false;
}
