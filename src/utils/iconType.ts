export const iconType = (type: string = "") => {
  const tl = type.toLowerCase();
  if (
    tl.includes("food") ||
    tl.includes("sandwich") ||
    tl.includes("burgers") ||
    tl.includes("chicken")
  ) {
    return "restaurant";
  }
  if (tl.includes("pizza")) {
    return "local_pizza";
  }

  switch (tl) {
    case "gas station":
      return "local_gas_station";
    case "hotel":
      return "hotel";
    default:
      return "help";
  }
};
