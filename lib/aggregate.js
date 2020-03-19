function isInLastSixHours(timestamp) {
  // Milliseconds - seconds - minutes - hours
  const oneHoursAgo = 1000 * 1 * 1 * 1;
  if (Date.now() - timestamp < oneHoursAgo) {
    console.log("Time is less than one hour ago!");
    return true;
  }
  return false;
}

function aggregate(scrapes) {
  const aggregateScrapes = [...scrapes]
    .reverse()
    .map(scrape => {
      const date = new Date(scrape.date);
      const optionalHour = isInLastSixHours(scrape.date)
        ? `-${date.getHours()}`
        : ``;
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}${optionalHour}`;
      return {
        key,
        ...scrape
      };
    })
    .reduce((accumulator, currentScrape) => {
      // If it's not found, we want to keep it
      if (!accumulator.find(scrape => scrape.key === currentScrape.key)) {
        return [...accumulator, currentScrape];
      }
      return accumulator;
    }, [])
    .reverse();
  return aggregateScrapes;
}

module.exports = {
  aggregate
};
