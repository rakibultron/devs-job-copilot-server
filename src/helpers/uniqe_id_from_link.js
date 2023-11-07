exports.extractId = async (str) => {
  // Using match with regEx
  let matches = await str.replace(/^\D+/g, "");
  if (matches) {
    return matches;
  }
};
