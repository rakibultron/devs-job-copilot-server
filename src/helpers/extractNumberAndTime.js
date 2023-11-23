const { sub, add, toDate, format, parseISO } = require("date-fns");
function extractNumberAndTime(inputString) {
  const currentTime = new Date();
  const regex =
    /(\d+)\s*(year|month|week|day|hour|minute|second|yr|mo|wk|dy|hr|min|sec)s?/gi;

  let match;

  while ((match = regex.exec(inputString)) !== null) {
    const quantity = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();

    const timeObj = {};
    timeObj[`${unit}` + "s"] = quantity;
    const timeStamps = sub(currentTime, timeObj);

    console.log({ timeStamps });
    const date = toDate(timeStamps);

    const formatedDate = format(date, "yyyy-MM-dd");

    return formatedDate;
  }
}

// Example
// const inputString = "2 month ago";
// const result = extractNumberAndTime(inputString);
// console.log(result);

module.exports = extractNumberAndTime;
