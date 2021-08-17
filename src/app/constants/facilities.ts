import { Facility } from '../interfaces/facility';

// export const facilities: Facility[] = [
//   // CES
//   {
//     state: 'CES',
//     site: 'Al Sabah C Hospital',
//     code: 'ALS',
//   },
//   {
//     state: 'CES',
//     site: 'Buluk Hospital',
//     code: 'PH',
//   },
//   {
//     state: 'CES',
//     site: 'Central prison',
//     code: 'CNP',
//   },
//   {
//     state: 'CES',
//     site: 'Juba Teaching Hospital',
//     code: 'JTH',
//   },
//   {
//     state: 'CES',
//     site: 'Nesitu PHCC',
//     code: 'NES',
//   },
//   {
//     state: 'CES',
//     site: 'Dombosco PHCC',
//     code: 'DOM',
//   },
//   {
//     state: 'CES',
//     site: 'Morobo PHCC',
//     code: 'MOR',
//   },
//   {
//     state: 'CES',
//     site: 'Kaya PHCC',
//     code: 'KAY',
//   },
//   {
//     state: 'CES',
//     site: 'Hamia PHCC',
//     code: 'HAM',
//   },
//   {
//     state: 'CES',
//     site: 'St Bakita PHCC',
//     code: 'BHC',
//   },
//   {
//     state: 'CES',
//     site: 'Yei State Hospital',
//     code: 'YE',
//   },
//   // EES
//   {
//     state: 'EES',
//     site: 'St Theresa M Hospital',
//     code: 'IMH',
//   },
//   {
//     state: 'EES',
//     site: 'Riwoto PHCCC',
//     code: 'RIW',
//   },
//   {
//     state: 'EES',
//     site: 'Kapoeta State Hospital',
//     code: 'KSH',
//   },
//   {
//     state: 'EES',
//     site: 'Nank nak PHCC',
//     code: 'NAK',
//   },
//   {
//     state: 'EES',
//     site: 'Abara PHCC',
//     code: 'ABA',
//   },
//   {
//     state: 'EES',
//     site: 'Lobone PHCC',
//     code: 'LOB',
//   },
//   {
//     state: 'EES',
//     site: 'Magwi PPHCC',
//     code: 'MGW',
//   },
//   {
//     state: 'EES',
//     site: 'Nimule Hospital',
//     code: 'NMC',
//   },
//   {
//     state: 'EES',
//     site: 'Obbo PHCC',
//     code: 'OKO',
//   },
//   {
//     state: 'EES',
//     site: 'Pajok PHCC',
//     code: 'PJK',
//   },
//   {
//     state: 'EES',
//     site: 'Hiyala PHCC',
//     code: 'HIY',
//   },
//   {
//     state: 'EES',
//     site: 'Nyong PHCC',
//     code: 'NYG',
//   },
//   {
//     state: 'EES',
//     site: 'Torit Hospital',
//     code: 'TR',
//   },
//   // LS
//   {
//     state: 'LS',
//     site: 'Rumbek State Hospital',
//     code: 'RK',
//   },
//   {
//     state: 'LS',
//     site: 'Kirr Mayardit W Hospital',
//     code: 'KWH',
//   },
//   {
//     state: 'LS',
//     site: 'Malual Bab PHCC',
//     code: 'MB',
//   },
//   {
//     state: 'LS',
//     site: 'Dioces of Rumbek PHCC',
//     code: 'DOR',
//   },
//   {
//     state: 'LS',
//     site: 'Kuel Kuech PHCU',
//     code: 'KUK',
//   },
//   {
//     state: 'LS',
//     site: 'Malou PHCU',
//     code: 'MAL',
//   },
//   {
//     state: 'LS',
//     site: 'Pacong PHCC',
//     code: 'PAC',
//   },
//   {
//     state: 'LS',
//     site: 'Nyang PHCC',
//     code: 'NYA',
//   },
//   {
//     state: 'LS',
//     site: 'Abang PHCC',
//     code: 'ABN',
//   },
//   {
//     state: 'LS',
//     site: 'Aluak luak PHCC',
//     code: 'ALK',
//   },
//   {
//     state: 'LS',
//     site: 'Anoul PHCC ',
//     code: 'ANO',
//   },
//   {
//     state: 'LS',
//     site: 'Marry Imacculate Mapourdit Hospital',
//     code: 'MPC',
//   },
//   {
//     state: 'LS',
//     site: 'Yirol State Hospital',
//     code: 'YSH',
//   },
//   {
//     state: 'LS',
//     site: 'St Joseph PHCC',
//     code: 'SEJ',
//   },
//   //   WBG
//   {
//     state: 'WBG',
//     site: 'Wau Teaching Hospital',
//     code: 'WTH',
//   },
//   //   WES
//   {
//     state: 'WES',
//     site: 'Andari PHCU',
//     code: 'AND',
//   },
//   {
//     state: 'WES',
//     site: 'EZO Hospital',
//     code: 'EZ',
//   },
//   {
//     state: 'WES',
//     site: 'Yangiri Primary Health Care Centre',
//     code: 'YNR',
//   },
//   {
//     state: 'WES',
//     site: 'Madoro PHCU',
//     code: 'MDR',
//   },
//   {
//     state: 'WES',
//     site: 'Naandi Primary Health Care Centre',
//     code: 'NAN',
//   },
//   {
//     state: 'WES',
//     site: 'Maridi County Hospital',
//     code: 'MAD',
//   },
//   {
//     state: 'WES',
//     site: 'Lui County Hospital',
//     code: 'LUI',
//   },
//   {
//     state: 'WES',
//     site: 'Mundri West PHCC',
//     code: 'MUN',
//   },
//   {
//     state: 'WES',
//     site: 'Mvolo PHCCC',
//     code: 'MVO',
//   },
//   {
//     state: 'WES',
//     site: 'Yeri PHCU',
//     code: 'YER',
//   },
//   {
//     state: 'WES',
//     site: 'Nzara Hospital',
//     code: 'NZ',
//   },
//   {
//     state: 'WES',
//     site: 'Nzara  PHCC',
//     code: 'NPHCC',
//   },
//   {
//     state: 'WES',
//     site: 'Basukangbi PHCC',
//     code: 'BSG',
//   },
//   {
//     state: 'WES',
//     site: 'Namaiku',
//     code: 'NMK',
//   },
//   {
//     state: 'WES',
//     site: 'Ringasi Primary Health Care Centre',
//     code: 'RIN',
//   },
//   {
//     state: 'WES',
//     site: 'Sakure Primary Health Care Centre',
//     code: 'SAK',
//   },
//   {
//     state: 'WES',
//     site: 'Sangua II Primary Health Care Centre',
//     code: 'SAG',
//   },
//   {
//     state: 'WES',
//     site: 'Bangasu Primary Health Care Centre',
//     code: 'BAG',
//   },
//   {
//     state: 'WES',
//     site: 'Gangura Primary Health Care Centre',
//     code: 'GNR',
//   },
//   {
//     state: 'WES',
//     site: 'Lirangau PHCC',
//     code: 'LRG',
//   },
//   {
//     state: 'WES',
//     site: 'Saura PHCU',
//     code: 'SUR',
//   },
//   {
//     state: 'WES',
//     site: 'Yambio Primary Health Care Centre',
//     code: 'YPHCC',
//   },
//   {
//     state: 'WES',
//     site: 'Bazungua Primary Health care centre',
//     code: 'BZG',
//   },
//   {
//     state: 'WES',
//     site: 'Masia PHCU',
//     code: 'MAS',
//   },
//   {
//     state: 'WES',
//     site: 'Yambio Hospital',
//     code: 'YSH',
//   },
// ];

// export const facilityStates = ['CES', 'EES', 'LS', 'WBG', 'WES'];

// const _facilitiesByState: any[] = [];

// facilityStates.forEach((state) => {
//   _facilitiesByState.push({
//     state,
//     facilities: facilities
//       .filter((facility) => facility.state == state)
//       .sort((a, b) => (a.site > b.site ? 1 : -1)),
//   });
// });

// export const facilitiesByState = _facilitiesByState;
