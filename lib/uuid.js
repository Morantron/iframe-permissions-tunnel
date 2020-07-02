// unique enough identifier
const chunk = () =>
  Math.round(Math.random() * Math.pow(2, 16))
    .toString(16)
    .padStart(4, "0");

export const uuid = () =>
  Array.from({ length: 6 })
    .map(chunk)
    .join("-");
