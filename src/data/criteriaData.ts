import { Criteria } from "@/types/psi";

export const CRITERIA_DATA: Criteria[] = [
  {
    id: "C1",
    name: "Pendidikan (Education)",
    type: "Benefit",
    options: [
      { label: "SMA/SMK", value: 1 },
      { label: "D3", value: 2 },
      { label: "S1", value: 3 },
      { label: "S2", value: 4 },
      { label: "S3", value: 5 },
    ],
  },
  {
    id: "C2",
    name: "Pengalaman Kerja (Work Experience)",
    type: "Benefit",
    options: [
      { label: "< 1 tahun", value: 1 },
      { label: "1 s/d 2 tahun", value: 2 },
      { label: "3 s/d 5 tahun", value: 3 },
      { label: "6 s/d 10 tahun", value: 4 },
      { label: "> 10 tahun", value: 5 },
    ],
  },
  {
    id: "C3",
    name: "Keahlian (Skill)",
    type: "Benefit",
    options: [
      { label: "Tidak sesuai bidang", value: 1 },
      { label: "Cukup sesuai", value: 2 },
      { label: "Sesuai", value: 3 },
      { label: "Sangat sesuai", value: 4 },
      { label: "Spesial/professional", value: 5 },
    ],
  },
  {
    id: "C4",
    name: "Lokasi (Distance from Home)",
    type: "Cost",
    options: [
      { label: "> 50 km", value: 1 },
      { label: "31 s/d 50 km", value: 2 },
      { label: "21 s/d 30 km", value: 3 },
      { label: "11 s/d 20 km", value: 4 },
      { label: "<= 10 km", value: 5 },
    ],
  },
  {
    id: "C5",
    name: "Gaji (Salary)",
    type: "Benefit",
    options: [
      { label: "< Rp. 3.000.000", value: 1 },
      { label: "Rp. 3.000.000 s/d Rp. 4.999.999", value: 2 },
      { label: "Rp. 5.000.000 s/d Rp. 6.999.999", value: 3 },
      { label: "Rp. 7.000.000 s/d Rp. 9.999.999", value: 4 },
      { label: ">= Rp10.000.000", value: 5 },
    ],
  },
  {
    id: "C6",
    name: "Usia (Age)",
    type: "Cost",
    options: [
      { label: "> 45 tahun", value: 1 },
      { label: "36 s/d 45 tahun", value: 2 },
      { label: "26 s/d 35 tahun", value: 3 },
      { label: "21 s/d 25 tahun", value: 4 },
      { label: "<= 20 tahun", value: 5 },
    ],
  },
  {
    id: "C7",
    name: "Status Karyawan (Employment Status)",
    type: "Benefit",
    options: [
      { label: "Freelance", value: 1 },
      { label: "Magang", value: 2 },
      { label: "Kontrak", value: 3 },
      { label: "Tetap", value: 4 },
      { label: "Tetap + Benefit (BPJS, bonus, dsb)", value: 5 },
    ],
  },
  {
    id: "C8",
    name: "Waktu Kerja (Working Hours)",
    type: "Benefit",
    options: [
      { label: "Shift malam", value: 1 },
      { label: "Shift bergantian", value: 2 },
      { label: "Fleksibel", value: 3 },
      { label: "Tetap (Jam kerja regular/8jam)", value: 4 },
      { label: "Tetap + lembur berbayar", value: 5 },
    ],
  },
  {
    id: "C9",
    name: "Reputasi Perusahaan (Company Reputation)",
    type: "Benefit",
    options: [
      { label: "Buruk (rating < 2.5)", value: 1 },
      { label: "Cukup (2.5 s/d 3.0)", value: 2 },
      { label: "Baik (3.1 s/d 3.9)", value: 3 },
      { label: "Sangat Baik (4.0 s/d 4.5)", value: 4 },
      { label: "Unggul (>= 4.6)", value: 5 },
    ],
  },
  {
    id: "C10",
    name: "Peluang Karier (Career Opportunities)",
    type: "Benefit",
    options: [
      { label: "Tidak ada promosi", value: 1 },
      { label: "Promosi kecil", value: 2 },
      { label: "Promosi sedang", value: 3 },
      { label: "Promosi cepat", value: 4 },
      { label: "Peluang karier sangat tinggi", value: 5 },
    ],
  },
];
