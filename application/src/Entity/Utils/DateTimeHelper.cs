using System;
using System.Collections.Generic;

namespace Scaffolding.Entity.Utils
{
    public static class DateTimeHelper
    {
        public static DateTime? ParseExactSafe(string val, string format)
        {
            if (string.IsNullOrWhiteSpace(val))
                return null;
            return DateTime.ParseExact(val, format, null);
        }

        public static string ToDateWithHoursAndMinutes(DateTime dt)
        {
            if ((dt.Hour == 0 && dt.Minute == 0) || (dt.Hour == 23 && dt.Minute == 59))
                return dt.ToString("d.M.yyyy");
            return dt.ToString("d.M.yyyy H:mm");
        }

        public static string ToTimeHHMM(this TimeSpan dt)
        {
            return dt.ToString(@"h\:mm");
        }

        public static string ToDateWithTime(this DateTime dt)
        {
            if (dt.Hour == 0 && dt.Minute == 0 || (dt.Hour == 23 && dt.Minute == 59))
                return dt.ToString("d.M.yyyy");
            return dt.ToString("d.M.yyyy H:mm:ss");
        }

        public static string ToDateWithHoursAndMinutesWithoutYear(DateTime dt)
        {
            if (dt.Hour == 0 && dt.Minute == 0)
                return dt.ToString("d.M.");
            return dt.ToString("d.M. HH:mm");
        }

        public static string ToHoursAndMinutes(DateTime dt)
        {
            return dt.ToString("H:mm");
        }

        public static string ToShortDate(DateTime dt)
        {
            return dt.ToString("d");
        }

        public static string ToShortDateWithNameOfDay(DateTime dt)
        {
            var nameOfDay = GetNameOfDay(dt);
            return nameOfDay + " " + dt.ToString("d");
        }

        private static string GetNameOfDay(DateTime dt)
        {
            string nameOfDay;
            switch (dt.DayOfWeek)
            {
                case DayOfWeek.Monday:
                    nameOfDay = "Pondělí";
                    break;
                case DayOfWeek.Friday:
                    nameOfDay = "Pátek";
                    break;
                case DayOfWeek.Saturday:
                    nameOfDay = "Sobota";
                    break;
                case DayOfWeek.Sunday:
                    nameOfDay = "Neděle";
                    break;
                case DayOfWeek.Thursday:
                    nameOfDay = "Čtvrtek";
                    break;
                case DayOfWeek.Tuesday:
                    nameOfDay = "Úterý";
                    break;
                case DayOfWeek.Wednesday:
                    nameOfDay = "Středa";
                    break;
                default:
                    throw new NotSupportedException();
            }

            return nameOfDay;
        }

        public static string ToShortDateWithNameOfDayWithoutYear(DateTime dt)
        {
            var nameOfDay = GetNameOfDay(dt);

            return nameOfDay + " " + ToShortDateWithoutYear(dt);
        }

        public static string ToShortDateTimeWithNameOfDayWithoutYear(DateTime dt)
        {
            var nameOfDay = GetNameOfDay(dt);

            return nameOfDay + " " + ToDateWithHoursAndMinutesWithoutYear(dt);
        }

        public static DateTime EndOfDay(DateTime dateTime)
        {
            return new DateTime(dateTime.Year, dateTime.Month, dateTime.Day, 23, 59, 59);
        }

        public static DateTime EndOfDayNow()
        {
            var dateTime = DateTime.Now;
            return new DateTime(dateTime.Year, dateTime.Month, dateTime.Day, 23, 59, 59);
        }

        public static DateTime StartOfDay(DateTime dateTime)
        {
            return new DateTime(dateTime.Year, dateTime.Month, dateTime.Day, 0, 0, 0);
        }

        public static DateTime StartOfDayNow()
        {
            var dateTime = DateTime.Now;
            return new DateTime(dateTime.Year, dateTime.Month, dateTime.Day, 0, 0, 0);
        }

        public static DateTime StartOfDayMonth(DateTime dateTime)
        {
            return new DateTime(dateTime.Year, dateTime.Month, 1, 0, 0, 0);
        }

        public static DateTime EndOfDayMonth(DateTime dateTime)
        {
            return new DateTime(dateTime.Year, dateTime.Month, DateTime.DaysInMonth(dateTime.Year, dateTime.Month), 0,
                0, 0);
        }

        public static string ToShortDateWithoutYear(DateTime date)
        {
            return date.ToString("d.M.");
        }


        public static string ToCzechShortDate(this DateTime date)
        {
            return date.ToString("d.M.yyyy");
        }

        public static string FormatDay(DateTime date)
        {
            return date.ToString("d");
        }

        public static string FormatDayForUrl(DateTime date)
        {
            return date.ToString("yyyy-MM-dd");
        }

        public static IEnumerable<DateTime> GetWeekends(DateTime startDate)
        {
            switch (startDate.DayOfWeek)
            {
                case DayOfWeek.Sunday:
                {
                    yield return startDate.AddDays(-1);
                    yield return startDate;
                    break;
                }
                case DayOfWeek.Saturday:
                {
                    yield return startDate;
                    yield return startDate.AddDays(1);
                    break;
                }
                case DayOfWeek.Friday:
                {
                    yield return startDate.AddDays(1);
                    yield return startDate.AddDays(2);
                    break;
                }
                case DayOfWeek.Thursday:
                {
                    yield return startDate.AddDays(2);
                    yield return startDate.AddDays(3);
                    break;
                }
                case DayOfWeek.Wednesday:
                {
                    yield return startDate.AddDays(3);
                    yield return startDate.AddDays(4);
                    break;
                }
                case DayOfWeek.Tuesday:
                {
                    yield return startDate.AddDays(4);
                    yield return startDate.AddDays(5);
                    break;
                }
                case DayOfWeek.Monday:
                {
                    yield return startDate.AddDays(5);
                    yield return startDate.AddDays(6);
                    break;
                }
            }
        }

        public static string ToTime(TimeSpan value)
        {
            return value.ToString(@"hh\:mm");
        }

        public static string ToTimeFromDateTime(DateTime value)
        {
            return value.TimeOfDay.ToString(@"hh\:mm");
        }

        public static string FormatDayEnglish(DateTime date)
        {
            return date.ToString("yyyy-MM-dd");
        }

        public static IEnumerable<DateTime> GetWeekendsWithFriday(DateTime startDate)
        {
            switch (startDate.DayOfWeek)
            {
                case DayOfWeek.Sunday:
                {
                    yield return startDate.AddDays(-2);
                    yield return startDate.AddDays(-1);
                    yield return startDate;
                    break;
                }
                case DayOfWeek.Saturday:
                {
                    yield return startDate.AddDays(-1);
                    yield return startDate;
                    yield return startDate.AddDays(1);
                    break;
                }
                case DayOfWeek.Friday:
                {
                    yield return startDate;
                    yield return startDate.AddDays(1);
                    yield return startDate.AddDays(2);
                    break;
                }
                case DayOfWeek.Thursday:
                {
                    yield return startDate.AddDays(1);
                    yield return startDate.AddDays(2);
                    yield return startDate.AddDays(3);
                    break;
                }
                case DayOfWeek.Wednesday:
                {
                    yield return startDate.AddDays(2);
                    yield return startDate.AddDays(3);
                    yield return startDate.AddDays(4);
                    break;
                }
                case DayOfWeek.Tuesday:
                {
                    yield return startDate.AddDays(3);
                    yield return startDate.AddDays(4);
                    yield return startDate.AddDays(5);
                    break;
                }
                case DayOfWeek.Monday:
                {
                    yield return startDate.AddDays(4);
                    yield return startDate.AddDays(5);
                    yield return startDate.AddDays(6);
                    break;
                }
            }
        }

        public static bool IsNotStartOfDay(DateTime datum)
        {
            return datum.TimeOfDay != TimeSpan.Zero;
        }
    }
}