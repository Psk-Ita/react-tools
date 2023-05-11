// opposite of the sum: given a number and a list of candidates, find those to sum to retrieve the provided input
export const spinOut = (value: number, options: number[]): number[] => {
  const fallback: number[] = [];

  if (value === 0 || options.length === 0) {
    return fallback;
  }

  const lst = options
    .filter((x) => x <= value)
    .sort((a, b) => (a < b ? 1 : -1));

  for (var i = 0; i < lst.length; i++) {
    // for duplicated values, avoid computation if already failed
    while (i > 0 && i < lst.length && lst[i] === lst[i - 1]) {
      i++;
    }
    const opt = lst.splice(i, 1)[0];
    const nextV = value - opt;
    if (nextV === 0) {
      return [opt];
    } else if (nextV < 0) {
      break;
    } else {
      const result = spinOut(nextV, lst);
      result.push(opt);
      const tot = result.reduce((p, c) => (p ?? 0) + c);
      if (tot === value) {
        return result.sort();
      }
    }
  }
  return fallback;
};
