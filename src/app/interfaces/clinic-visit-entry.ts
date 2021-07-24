import { Timestamp } from '@google-cloud/firestore';

export interface ClinicVisitEntry {
  lastClinicVisitDate: Timestamp | Date;
  clinicVisitComment: string;
  nextAppointmentDate?: Timestamp | Date;
  iitStatus?: string;
  facility?: string;
  dateTransferred?: Timestamp | Date;
}
