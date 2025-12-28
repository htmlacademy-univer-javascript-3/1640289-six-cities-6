import { MONTHS } from '../constants/date.ts';

export const getFormattedDate = (dateTime: string) => {
  const date = new Date(dateTime);

  const month = MONTHS[date.getMonth()];
  const year = date.getFullYear();

  return `${month} ${year}`;
};
