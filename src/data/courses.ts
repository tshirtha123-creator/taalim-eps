export type Course = {
  id: string;
  courseNumber: string;
  title: string;
  part?: string;
  url: string;
};

const links = [
  "1FdbJVmzL5", "18FaC9oymM", "1Ax1i1qgcj", "1EmT6a8Wvq", "1B4cNULbbD", "1EG4xEcGZE",
  "1C5H2m6pu1", "1EE3v8SPzb", "1AdaaWSodj", "19LxN1kbLB", "1D9Tg6Btvt", "1GBkVx7E1T",
  "1GA4GWv7NG", "1Vr5PNFYh5", "1VHUBuZykB", "1EFgRee1HB", "1JBDTSxMFX", "17rcyFnJAm",
  "14fGBsMK1Wi", "18EgR9n461", "1EweJokmTn", "1bviSQiWE7", "18wGcovLLL", "18QsYcDnpH",
  "1CvoqwGYmV", "1D69X74jiv", "1D3jjMtuWc", "18tXRYsaih"
];

export const courses: Course[] = links.map((code, index) => {
  const number = index < 7 ? index + 1 : index === 7 ? 7 : index;
  const part = index === 6 ? "Partie 1" : index === 7 ? "Partie 2" : undefined;
  return {
    id: `cours-${number}${part ? `-${part.endsWith("1") ? "p1" : "p2"}` : ""}`,
    courseNumber: String(number),
    title: `Cours ${number}`,
    part,
    url: `https://www.facebook.com/share/v/${code}/`,
  };
});
