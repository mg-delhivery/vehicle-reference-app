import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export const getUxDateDisplay = (dateMs?: number) => {
  if (!dateMs) {
    return '';
  }

  const date = dayjs(dateMs);
  const days = date.diff(dayjs(), 'day');
  const displayDate = days ? date.format('ll') : date.fromNow();

  if (!displayDate) {
    return '';
  }

  return displayDate;
};
