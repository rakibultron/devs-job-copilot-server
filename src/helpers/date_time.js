const { sub } = require("date-fns");

const postedAt = "4 hours ago";
const currentTime = new Date();

// Parse and calculate the new date
const newDate = (postedAt) => {
  const date = sub(currentTime, { hours: parseInt(postedAt) });

  return date;
};

newDate(postedAt);
