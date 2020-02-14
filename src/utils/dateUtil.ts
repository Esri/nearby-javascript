/**
 * Check if the current time is day or night
 * @param date
 */
export const isDay = (date: Date) => {
    const currentHour = date.getHours();
    return currentHour > 6 && currentHour < 18;
};
