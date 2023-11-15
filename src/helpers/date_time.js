const { sub, toDate, format, parseISO } = require("date-fns");

const postedAt = "4 hours ago";
const currentTime = new Date();

// Parse and calculate the new date
const newDate = (postedAt) => {
  const timeStamps = sub(currentTime, { hours: parseInt(postedAt) });
  const date = toDate(timeStamps);
  console.log(format(date, "hh:mm:ss a dd/LL/yyyy "));
  return date;
};
const StringToDate = (postedAt) => {
  const timeStamps = sub(currentTime, { hours: parseInt(postedAt) });
  const date = toDate(timeStamps);
  //   console.log(format(date, "hh:mm:ss a dd/LL/yyyy"));
  return date;
};

// newDate(postedAt);
module.exports = { StringToDate };
