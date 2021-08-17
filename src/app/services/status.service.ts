import { Injectable } from '@angular/core';
import { regimens } from '../constants/regimens';
import { diffDate } from '../functions/diffDate';
import { incDate } from '../functions/incDate';
import { EligibilityStatus } from '../interfaces/eligibility-status';

export declare type IITStatus =
  | 'active'
  | 'iit <= 1'
  | 'iit <= 3'
  | 'iit > 3'
  | null;

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
      regimen,
      regimenStartTransDate,
      eac3Completed,
      vlh,
    } = val;

    if (!(ARTStartDate && hvl && regimen && regimenStartTransDate)) return null;

    pmtct = pmtct == 'yes';
    eac3Completed = eac3Completed == 'yes';
    hvl = hvl == 'yes';

    const l = vlh?.length || 0;

    let isEligible = diffDate(new Date(), this.getNextVLDate(val) as Date) >= 0;
    const is2ndLine = l >= 2 && vlh[0].value >= 1000 && vlh[1].value >= 1000;

    if (isEligible && is2ndLine && !hvl && !eac3Completed)
      return ELIGIBLE_CONSIDER_EAC;

    if (isEligible)
      return hvl && !eac3Completed ? INELIGIBLE_CHECK_EAC : ELIGIBLE;
    return INELIGIBLE;
  }

  public getIITStatus(nextAppointmentDate: any): IITStatus {
    const today = new Date();
    if (nextAppointmentDate) {
      let cvhDiffDate = diffDate(today, nextAppointmentDate) / 30;
      if (cvhDiffDate < 0) return 'active';
      else if (cvhDiffDate >= 0 && cvhDiffDate <= 1) return 'iit <= 1';
      else if (cvhDiffDate > 1 && cvhDiffDate <= 3) return 'iit <= 3';
      else return 'iit > 3';
    }
    return null;
  }

  public getNextVLDate(val: any) {
    const {
      ARTStartDate,
      age,
      pmtctEnrollStartDate,
      regimenStartTransDate,
      vlh,
    } = val;

    const l = vlh?.length || 0;

    const mostCurrentVLDate = l ? vlh[0]?.dateSampleCollected : null;

    const isAdult: boolean = age.unit == 'year' && age.age >= 19;

    let latestDate = [
      mostCurrentVLDate,
      pmtctEnrollStartDate,
      regimenStartTransDate,
    ].reduce((date1, date2) => (date1 > date2 ? date1 : date2));

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
    } else if (
      l >= 2 &&
      (vlh[0].undetectableViralLoad || vlh[0]?.value < 1000) &&
      (vlh[1].undetectableViralLoad || vlh[1].value < 1000) &&
      isAdult
    ) {
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
