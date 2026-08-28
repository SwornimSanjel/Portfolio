import { unverified, type Fact } from "./verify";

export type EducationEntry = {
  id: string;
  institution: Fact;
  qualification: Fact;
  awardingBody?: Fact;
  display: string;
  result?: string;
  /** School-level entries render smaller — they don't need prominence. */
  emphasis: "primary" | "secondary";
};

export const education: EducationEntry[] = [
  {
    id: "herald",
    institution: "Herald College Kathmandu",
    qualification: unverified(
      "BSc (Hons) Computer Science",
      'LinkedIn records this as "Bachelor\'s in computer science". Confirm the exact awarded title as printed on the programme documentation.',
    ),
    awardingBody: unverified(
      "University of Wolverhampton",
      "Confirm the awarding-body line exactly as it appears on official documentation before publishing it.",
    ),
    display: "Nov 2024 to May 2027",
    emphasis: "primary",
  },
  {
    id: "plus-two",
    institution: unverified(
      "United Academy",
      'The brief says "United College"; LinkedIn says "United Academy". Which is correct for the +2?',
    ),
    qualification: "+2, Science",
    display: "Aug 2022 to May 2024",
    result: "GPA 3.58 / 4.0 · A",
    emphasis: "secondary",
  },
  {
    id: "school",
    institution: "United Academy",
    qualification: "School, grades 1 to 10 (SEE)",
    display: "Until 2022",
    result: "GPA 3.75 / 4.0 · A+",
    emphasis: "secondary",
  },
];

export type Certification = {
  title: string;
  issuer: string;
  issued: string;
  credentialId: string;
};

export const certifications: Certification[] = [
  {
    title: "Web Application Development",
    issuer: "Herald College Kathmandu",
    issued: "Aug 2025",
    credentialId: "HCKCS4A240023VYB6J",
  },
  {
    title: "Database",
    issuer: "Herald College Kathmandu",
    issued: "Jul 2025",
    credentialId: "HCKCS4A240023XLZLW",
  },
];
