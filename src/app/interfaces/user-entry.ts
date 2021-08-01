import {} from '@google-cloud/firestore';
import { ClinicVisitEntry } from './clinic-visit-entry';
import { Regimen } from './regimen';
import { ViralLoadEntry } from './viral-load-entry';

export interface UserEntry {
  entryDate: Date;
  sex: string;
  uniqueARTNumber: string;
  birthdate?: Date;
  birthdateKnown?: boolean;
  age?: number;
  ageUnit?: string;
  phoneNumber?: string;
  ARTStartDate: Date;
  regimen: Regimen;
  regimenStartTransDate: Date;
  pmtct: boolean;
  pmtctEnrollStartDate?: Date;
  hvl: boolean;
  eac3Completed?: boolean;
  eac3CompletionDate?: Date;
  vlh: ViralLoadEntry[];
  cvh: ClinicVisitEntry[];
}
