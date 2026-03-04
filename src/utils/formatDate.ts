import { format } from 'date-fns';

export function formatDate(value: string | number | Date, fmt = "PPP") {
  try {
    return format(new Date(value), fmt);
  } catch (e) {
    return String(value);
  }
}
