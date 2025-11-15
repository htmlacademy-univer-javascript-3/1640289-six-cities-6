export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const getFormattedDate = (dateTime: string) => {
  const date = new Date(dateTime);

  const month = MONTHS[date.getMonth()];
  const year = date.getFullYear();

  return `${month} ${year}`;
};
