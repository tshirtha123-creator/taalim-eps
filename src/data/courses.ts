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
  "1CvoqwGYmV", "1D69X74jiv", "1D3jjMtuWc", "1CvkKwczGt", "1BgEyVpXWe", "1EGWV1rHgK",
  "18AqCfQdNo", "1D1zUTC4pq", "18f76Pk6Ja", "19HREPDUms", "14ko1TwZQD6", "1AWwnoo8qW",
  "17yWdMp39r", "1PvZENYYMj", "1C1zGgaKhc", "1Bxy7wX82M", "1DLucs1VT2", "1Epv89ckKy",
  "14wmTm1DjE9", "1bTW2nQAdV", "1EieFaizQp", "1BgT7KzeBx",
  "https://www.facebook.com/reel/2344257259476911"
];

export const courses: Course[] = links.map((code, index) => {
  const partNumber = index === 6 || index === 7
    ? index - 5
    : index >= 43 && index <= 45
      ? index - 42
      : undefined;
  const number = index < 7 ? index + 1 : index === 7 ? 7 : index <= 43 ? index : index <= 45 ? 43 : index - 2;
  const part = partNumber ? `Partie ${partNumber}` : undefined;
  return {
    id: `cours-${number}${partNumber ? `-p${partNumber}` : ""}`,
    courseNumber: String(number),
    title: `Cours ${number}`,
    part,
    url: code.startsWith("https://") ? code : `https://www.facebook.com/share/v/${code}/`,
  };
});
