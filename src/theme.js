// Palette carried over from the Fashion Transparency Index project's
// earthy design system, tuned for readability: deep forest text on a
// warm sand background is high-contrast without the glare of pure
// white, which matters for aging eyes.
export const C = {
  forest: "#1C2B2D",
  teal: "#3D6B6E",
  tealDark: "#2E5457",
  terracotta: "#C4622D",
  sage: "#8FAF9F",
  sand: "#EFE7D6",
  card: "#FBF7EE",
  line: "#D8CDB6",
};

// All type sizes route through a user-controlled scale (the A+ toggle).
// Base body text is 20px — already above the 18px accessibility floor.
export function makeStyles(scale) {
  const fs = (px) => `${Math.round(px * scale)}px`;

  return {
    fs,
    page: {
      minHeight: "100vh",
      background: C.sand,
      color: C.forest,
      fontFamily: "'Atkinson Hyperlegible', 'Segoe UI', system-ui, sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "16px",
    },
    card: {
      background: C.card,
      border: `1px solid ${C.line}`,
      borderRadius: "20px",
      padding: "28px 24px",
      width: "100%",
      maxWidth: "560px",
    },
    h1: {
      fontFamily: "'Fraunces', Georgia, serif",
      fontSize: fs(34),
      fontWeight: 600,
      lineHeight: 1.2,
      margin: "0 0 12px 0",
    },
    body: { fontSize: fs(20), lineHeight: 1.55, margin: "0 0 8px 0" },
    bigButton: (bg = C.teal, color = "#fff") => ({
      display: "block",
      width: "100%",
      minHeight: "60px",
      fontSize: fs(21),
      fontWeight: 700,
      fontFamily: "inherit",
      background: bg,
      color,
      border: "none",
      borderRadius: "14px",
      padding: "14px 20px",
      cursor: "pointer",
      marginTop: "14px",
    }),
    quietButton: {
      display: "block",
      width: "100%",
      minHeight: "52px",
      fontSize: fs(18),
      fontFamily: "inherit",
      background: "transparent",
      color: C.teal,
      border: `2px solid ${C.sage}`,
      borderRadius: "14px",
      padding: "12px 20px",
      cursor: "pointer",
      marginTop: "12px",
    },
    choiceButton: (selected) => ({
      flex: 1,
      minHeight: "96px",
      fontSize: fs(18),
      fontWeight: 700,
      fontFamily: "inherit",
      background: selected ? C.teal : "#fff",
      color: selected ? "#fff" : C.forest,
      border: `2px solid ${selected ? C.teal : C.line}`,
      borderRadius: "16px",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
    }),
  };
}
