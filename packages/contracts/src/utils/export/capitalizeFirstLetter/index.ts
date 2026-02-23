export const capitalizeFirstLetter = (str: string) => {
  if (str && typeof str === "string") {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return str; // Return input as-is if it's empty or not a string
};
