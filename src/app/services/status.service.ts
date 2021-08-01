import { Injectable } from '@angular/core';
import { regimens } from '../constants/regimens';
import { diffDate } from '../functions/diffDate';
import { incDate } from '../functions/incDate';
import { EligibilityStatus } from '../interfaces/eligibility-status';

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

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  constructor() {}

  public getEligibilityStatus(val: any): EligibilityStatus | null {
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

    if (!(ARTStartDate && hvl && regimen && regimenStartTransDate)) return null;

    pmtct = pmtct == 'yes';
    eac3Completed = eac3Completed == 'yes';
    hvl = hvl == 'yes';

    const isAdult: boolean = Object.keys(age)[0] == 'year' && age.year >= 19;

    const today = new Date();
    const artDiff = diffDate(today, ARTStartDate);
    const regDiff = diffDate(today, regimenStartTransDate);
    const l = vlh?.length || 0;

    let isEligible = diffDate(new Date(), this.getNextVLDate(val) as Date) >= 0;
    const is2ndLine = l >= 2 && vlh[0].value >= 1000 && vlh[1].value >= 1000;

    if (isEligible && is2ndLine && !hvl && !eac3Completed)
      return ELIGIBLE_CONSIDER_EAC;

    if (isEligible)
      return hvl && !eac3Completed ? INELIGIBLE_CHECK_EAC : ELIGIBLE;
    return INELIGIBLE;
  }

  public getIITStatus(nextAppointmentDate: any) {
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

  public getNextVLDate(val: any) {
    const {
      ARTStartDate,
      age,
      _pmtct,
      pmtctEnrollStartDate,
      regimenStartTransDate,
      vlh,
    } = val;

    const l = vlh?.length || 0;

    const pmtct = _pmtct == 'yes';

    const mostCurrentVLDate = l ? vlh[0]?.dateSampleCollected : null;

    const isAdult: boolean = (age?.year || 0) >= 19;

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

    if (
      new Set([
        ARTStartDate?.getTime(),
        regimenStartTransDate?.getTime(),
        pmtctEnrollStartDate?.getTime(),
      ]).size == 1 &&
      !l
    ) {
      inc = 90;
    } else if (l >= 2 && vlh[0].value < 1000 && vlh[1].value && isAdult) {
      inc = 365;
    } else {
      inc = 180;
    }

    return incDate(latestDate, inc);
  }

  public getEligibilityStatusByNextVLDate(
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
}
