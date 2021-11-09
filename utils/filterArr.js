const filtredArr = (from, to, arr = []) => {
  return arr
    .filter((x) => {
      if (from && to)
        return (
          x.date.getTime() >= from.getTime() && x.date.getTime() <= to.getTime()
        );
      if (from) return x.date.getTime() >= from.getTime();
      if (to) return x.date.getTime() <= to.getTime();
      return true;
    })
    .map((x) => {
      const { description, duration, date } = x;
      return {
        description,
        duration,
        date,
      };
    });
};

module.exports = filtredArr;
