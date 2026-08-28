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

/**
 * Kept deliberately short. School-level results and GPAs were listed here and
 * have been removed: on a founder's page they compete with the work for
 * attention and lose, and a reader deciding whether to hire the company is
 * not weighing a +2 grade. The degree in progress is the only credential
 * that carries any signal, so it is the only one given room.
 */
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
];

