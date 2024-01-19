import { format, formatDistanceToNow, subDays } from 'date-fns';
import { v4 } from 'uuid';

export function generateGuid() {
  return v4();
}

export function formatRelativeDate(date: Date) {
  if (date > subDays(new Date(), 3)) {
    return formatDistanceToNow(date) + ' ago';
  }

  return format(date, 'MMM dd, yyyy');
}
