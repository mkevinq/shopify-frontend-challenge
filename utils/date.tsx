/**
 * Formats a given date into YYYY MM DD.
 *
 * @param {Date} date - Date to turn into the YYYY MM DD format.
 * @param {string} sep - Characters used to separate the year, month and date. "-" by default.
 * @returns {string} - Date in the YYYY MM DD string format.
 */
export const formatDate = (date: Date, sep: string = "-") => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return [year, month, day].join(sep);
};

/**
 * @param {string} date - Date in string format.
 * @returns {boolean} - Whether the date string is valid or not.
 */
export const verifyDate = (date: string) => {
  try {
    new Date(date);
    return true;
  } catch (error) {
    return false;
  }
};
