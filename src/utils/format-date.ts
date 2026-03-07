import { format, isValid } from "date-fns";


export const formatDate = (
  date: Date | string | number | null | undefined,
  formatStr: string = "dd MMM yyyy",
): string => {
  if (!date) return "N/A";

  const dateObj = new Date(date);

  if (!isValid(dateObj)) return "Invalid Date";

  return format(dateObj, formatStr);
};


export const formatTime = (date: Date | string | number): string => {
  const dateObj = new Date(date);
  if (!isValid(dateObj)) return "Invalid Time";
  return format(dateObj, "p");
};
