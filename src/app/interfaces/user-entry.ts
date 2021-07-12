import { Timestamp } from '@google-cloud/firestore';
import { Regimen } from './regimen';
import { ViralLoadEntry } from './viral-load-entry';

export interface UserEntry {
  sex: string;
  uniqueARTNumber: string;
  birthdate: Timestamp | Date;
  ARTStartDate: Timestamp | Date;
  regimen: Regimen;
  regimenStartTransDate: Timestamp | Date;
  pmtct: boolean;
  pmtctEnrollStartDate?: Timestamp | Date;
  hvl: boolean;
  eac3Completed?: boolean;
  eac3CompletionDate?: Timestamp | Date;
  lastClinicVisitDate?: Timestamp | Date;
  clinicVisitComment?: string;
  nextAppointmentDate?: Timestamp | Date;
  vlh: ViralLoadEntry[];
}
