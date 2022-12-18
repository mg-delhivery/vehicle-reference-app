import { DateTime } from "luxon";

export const getUxDateDisplay = (dateMs?: number) => {
  if (!dateMs) {
    return '';
  }

  const date = DateTime.fromMillis(dateMs);
  const { days } = DateTime.now().diff(date, 'days');
  const displayDate =
    days > 1 ? date.toLocaleString(DateTime.DATE_MED) : date.toRelative();

  if (!displayDate) {
    return '';
  }

  return displayDate;
};