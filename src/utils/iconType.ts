export const iconType = (type: string = "") => {
  const tl = type.toLowerCase();
  if (
    tl.includes("coffee") ||
    tl.includes("cafe")
  ) {
    return "local_cafe";
  }
  if (
    tl.includes("bar") ||
    tl.includes("drinks") ||
    tl.includes("pub")
  ) {
    return "local_bar";
  }
  if (
    tl.includes("food") ||
    tl.includes("sandwich") ||
    tl.includes("burgers") ||
    tl.includes("chicken") ||
    tl.includes("fondue") ||
    tl.includes("steak") ||
    tl.includes("breakfast") ||
    tl.includes("lunch") ||
    tl.includes("dinner") ||
    tl.includes("diner")
  ) {
    return "local_dining";
  }
  if (tl.includes("pizza")) {
    return "local_pizza";
  }
  if (
    tl.includes("hotel") ||
    tl.includes("motel")
  ) {
    return "hotel";
  }

  return "help";
};
