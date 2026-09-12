// Palette carried over from the Fashion Transparency Index project's
// earthy design system, tuned for readability: deep forest text on a
// warm sand background is high-contrast without the glare of pure
// white, which matters for aging eyes.
export const C = {
  // Brand palette from the Daily Companion logo:
  //   blue #004AAD, yellow #FFDE59, burgundy #70091D
  //
  // Structure: BLUE is the page (a receding colour, easy on the eye at
  // full-screen size), NEAR-WHITE cards carry all the reading, YELLOW
  // is the welcome hero, BURGUNDY is the accent that marks "this one".
  // Text never sits on a saturated field it has to be read off of.
  //
  // Measured contrast — ink on card ~15:1, blue on card 7.9:1,
  // burgundy on card 11.7:1, white on blue page 8.1:1, yellow on blue
  // page 6.1:1, ink on yellow card 12.7:1, white on burgundy 11.7:1.
  //
  // Key names are inherited from the original palette so components
  // pick up the brand without edits.
  forest: "#1C1B2E",     // body text on light surfaces
  teal: "#004AAD",       // brand blue: primary buttons, secondary text
  tealDark: "#00347A",   // deeper blue
  terracotta: "#70091D", // brand burgundy: accents, today, focus rings
  sage: "#9BB4E0",       // soft blue: secondary borders on cards
  sand: "#004AAD",       // page background (brand blue)
  card: "#FFFDF7",       // card surface: near-white for readable text
  line: "#E8CE7A",       // warm gold: borders and dividers
  yellow: "#FFDE59",     // brand yellow: welcome hero, current step
  onSand: "#FFFFFF",     // text that sits directly on the blue page
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
