const { sub, add, toDate, format, parseISO } = require("date-fns");

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
  //   console.log(format(date, "yyyy/LL/dd"));
  const formatedDate = format(date, "yyyy-MM-dd");
  return formatedDate;
};

function calculateRelativeDate(unit, amount) {
  const currentDate = new Date();

  switch (unit.toLowerCase()) {
    // case "years":
    //   return add(currentDate, { years: -amount });
    // case "months":
    //   return add(currentDate, { months: -amount });
    // case "days":
    //   return add(currentDate, { days: -amount });
    case "weeks":
      return format(add(currentDate, { weeks: -amount }), "dd-LL-yyyy");
    default:
      throw new Error(
        "Invalid unit. Supported units are year, month, day, and week."
      );
  }
}

// Example usage:
// const twoMonthsAgo = calculateRelativeDate("months", 2);
// const oneYearAgo = calculateRelativeDate("years", 1);
// const tenDaysAgo = calculateRelativeDate("days", 10);
const threeWeeksAgo = calculateRelativeDate("weeks", 3);

// console.log("Two months ago:", twoMonthsAgo);
// console.log("One year ago:", oneYearAgo);
// console.log("Ten days ago:", tenDaysAgo);
console.log("Three weeks ago:", threeWeeksAgo);

// newDate(postedAt);
module.exports = { StringToDate };
