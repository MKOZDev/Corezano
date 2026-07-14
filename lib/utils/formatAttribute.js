export function getBrandFromName(name) {
  if (!name) return "";
  return name.split(" ")[0];
}

export function prettifyAttributeValue(slug) {
  if (!slug) return "";
  const UNIT_MAP = {
    gb: "GB",
    mb: "MB",
    tb: "TB",
    mhz: "MHz",
    ghz: "GHz",
    mm: "mm",
    cm: "cm",
    w: "W",
    v: "V",
  };
  return slug
    .split("-")
    .map((word) => {
      const lower = word.toLowerCase();
      if (UNIT_MAP[lower]) return UNIT_MAP[lower];
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}
