export const experienceYears = Array.from(
  { length: 41 },
  (_, i) => ({
    label: `${i} Year${i !== 1 ? "s" : ""}`,
    value: i,
  })
);

export const experienceMonths = Array.from(
  { length: 12 },
  (_, i) => ({
    label: `${i} Month${i !== 1 ? "s" : ""}`,
    value: i,
  })
);