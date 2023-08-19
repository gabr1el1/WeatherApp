function diffDays(date1, date2) {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  //Discard the time and time-zone information.
  //Date.UTC() gives milliseconds from unix date in 1970
  const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());

  let diff = Math.floor((utc2 - utc1) / _MS_PER_DAY);
  if (diff <= 3) {
    return diff;
  }
  throw new Error("Can't forecast more than three days");
}

export { diffDays };
