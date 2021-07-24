import { Timestamp } from '@google-cloud/firestore';
import { ClinicVisitEntry } from './clinic-visit-entry';
import { Regimen } from './regimen';
import { ViralLoadEntry } from './viral-load-entry';

export interface UserEntry {
  entryDate: Date | Timestamp;
  sex: string;
  uniqueARTNumber: string;
  birthdate?: Timestamp | Date;
  birthdateKnown?: boolean;
  age?: number;
  ageUnit?: string;
  phoneNumber?: string;
  ARTStartDate: Timestamp | Date;
  regimen: Regimen;
  regimenStartTransDate: Timestamp | Date;
  pmtct: boolean;
  pmtctEnrollStartDate?: Timestamp | Date;
  hvl: boolean;
  eac3Completed?: boolean;
  eac3CompletionDate?: Timestamp | Date;
  vlh: ViralLoadEntry[];
  cvh: ClinicVisitEntry[];
}
