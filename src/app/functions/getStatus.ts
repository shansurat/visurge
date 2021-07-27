import { regimens } from '../constants/regimens';
import { EligibilityStatus } from '../interfaces/eligibility-status';
import { ViralLoadEntry } from '../interfaces/viral-load-entry';
import { diffDate } from './diffDate';
import { getAge } from './getAge';
import { incDate } from './incDate';

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
  let { hvl, eac3Completed, vlh } = val;

  eac3Completed = eac3Completed == 'yes';
  hvl = hvl == 'yes';

  const today = new Date();
  const l = vlh?.length || 0;

  const isEligible = diffDate(today, getNextVLDate(val) as Date) >= 0;
  const is2ndLine = l >= 2 && vlh[0].value >= 1000 && vlh[1].value >= 1000;

  if (isEligible && is2ndLine && !hvl && !eac3Completed)
    return ELIGIBLE_CONSIDER_EAC;

  if (isEligible)
    return hvl && !eac3Completed ? INELIGIBLE_CHECK_EAC : ELIGIBLE;
  return INELIGIBLE;
}

export function getEligibilityStatusByNextVLDate(
  nextVLDate: Date,
  hvl: boolean,
  eac3Completed: boolean,
  vlh: any[]
) {
  const today = new Date();
  const l = vlh?.length || 0;

  const isEligible = diffDate(today, nextVLDate as Date) >= 0;
  const is2ndLine = l >= 2 && vlh[0].value >= 1000 && vlh[1].value >= 1000;

  if (isEligible && is2ndLine && !hvl && !eac3Completed)
    return ELIGIBLE_CONSIDER_EAC;

  if (isEligible)
    return hvl && !eac3Completed ? INELIGIBLE_CHECK_EAC : ELIGIBLE;
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

export function getNextVLDate(val: any) {
  const {
    ARTStartDate,
    age,
    _hvl,
    _pmtct,
    pmtctEnrollStartDate,
    regimen,
    regimenStartTransDate,
    _eac3Completed,
    vlh,
  } = val;
  console.log(val);

  const l = vlh?.length || 0;

  const pmtct = _pmtct == 'yes';
  const eac3Completed = _eac3Completed == 'yes';
  const hvl = _hvl == 'yes';

  const mostCurrentVLDate = l ? vlh[0]?.dateSampleCollected : null;

  const isAdult: boolean = (age?.years || 0) >= 19;

  const regimenIsTLD =
    regimens.find((_regimen) => _regimen.code == regimen)?.category == 'TLD';
  const regimenIs2ndLine = regimens
    .find((_regimen) => _regimen.code == regimen)
    ?.ageCategory.includes('2');

  // Setting the latest date
  let latestDate;
  if (mostCurrentVLDate) latestDate = mostCurrentVLDate;
  else {
    latestDate =
      pmtct && diffDate(pmtctEnrollStartDate, regimenStartTransDate) >= 0
        ? pmtctEnrollStartDate
        : regimenStartTransDate;
  }

  if (!latestDate) return null;

  let inc!: number;
  console.log(vlh);
  if (
    new Set([ARTStartDate, regimenStartTransDate, pmtctEnrollStartDate]).size ==
      1 &&
    !l
  ) {
    inc = 90;
  } else if (l >= 2 && !isHVL(vlh[0]) && !isHVL(vlh[1])) {
    inc = 365;
  } else {
    inc = 180;
  }

  return incDate(latestDate, inc);
}

function isHVL(vl: ViralLoadEntry) {
  return !(vl.undetectableViralLoad || vl.value < 1000);
}
