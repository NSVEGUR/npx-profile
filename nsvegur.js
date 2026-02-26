#!/usr/bin/env node
"use strict";

import c from "chalk";
import ww from "word-wrap";
import iq from "inquirer";
import open from "open";
import stripAnsi from "strip-ansi";

const visibleLength = (str) => stripAnsi(str).length;
function gradientText(text, startColor, endColor) {
  const lines = text.split("\n");

  const interpolate = (start, end, factor) =>
    Math.round(start + (end - start) * factor);

  const parseHex = (hex) =>
    hex
      .replace("#", "")
      .match(/.{1,2}/g)
      .map((x) => parseInt(x, 16));

  const [r1, g1, b1] = parseHex(startColor);
  const [r2, g2, b2] = parseHex(endColor);

  return lines
    .map((line, i) => {
      const factor = i / lines.length;
      const r = interpolate(r1, r2, factor);
      const g = interpolate(g1, g2, factor);
      const b = interpolate(b1, b2, factor);
      return c.rgb(r, g, b)(line);
    })
    .join("\n");
}
function renderDomainHeader(centerTitle, pillars, pillarColors) {
  if (!Array.isArray(pillars) || pillars.length !== 4) {
    throw new Error("renderDomainHeader requires exactly 4 pillar strings.");
  }

  if (!Array.isArray(pillarColors) || pillarColors.length !== 4) {
    throw new Error("renderDomainHeader requires exactly 4 hex colors.");
  }

  const termWidth = process.stdout.columns || 80;
  const MIN_GAP = 6;

  // Determine max pillar width (text only)
  const maxTextLength = Math.max(...pillars.map((p) => p.length));
  const pillWidth = maxTextLength + 4; // padding + borders

  // Calculate required layout width
  const requiredWidth = pillWidth * 2 + MIN_GAP;

  // Constrain design width
  const DESIGN_WIDTH = Math.min(Math.max(requiredWidth, 60), termWidth - 4);

  const SIDE_PADDING = Math.max(0, Math.floor((termWidth - DESIGN_WIDTH) / 2));

  const padWhole = (line) => " ".repeat(SIDE_PADDING) + line;

  const buildPill = (text, colorHex, arrowChar, arrowSide) => {
    const padded = ` ${text.padEnd(maxTextLength)} `;
    const top = `╭${"─".repeat(maxTextLength + 2)}╮`;
    const mid = `│${padded}│`;
    const bot = `╰${"─".repeat(maxTextLength + 2)}╯`;

    const lines = [top, mid, bot];

    const ARROW_PADDING = 4;

    if (arrowSide === "right") {
      lines[1] = lines[1] + " " + arrowChar;
    } else if (arrowSide === "left") {
      lines[1] = arrowChar + " " + lines[1];
      lines[0] = " ".repeat(ARROW_PADDING) + lines[0];
      lines[2] = " ".repeat(ARROW_PADDING) + lines[2];
    }

    return lines.map((line) => padWhole(c.hex(colorHex)(line)));
  };

  const GAP = Math.max(MIN_GAP, DESIGN_WIDTH - pillWidth * 2);

  const composeRow = (left, right) =>
    left.map((line, i) => {
      const cleanLeft = line.slice(SIDE_PADDING);
      const cleanRight = right[i].slice(SIDE_PADDING);
      return padWhole(cleanLeft + " ".repeat(GAP) + cleanRight);
    });

  const topLeft = buildPill(pillars[0], pillarColors[0], "↘", "right");
  const topRight = buildPill(pillars[1], pillarColors[1], "↙", "left");
  const bottomLeft = buildPill(pillars[2], pillarColors[2], "↗", "right");
  const bottomRight = buildPill(pillars[3], pillarColors[3], "↖", "left");

  const allRows = [...topLeft, ...topRight, ...bottomLeft, ...bottomRight];
  const maxRowWidth = Math.max(...allRows.map((line) => visibleLength(line)));

  const centerLine = (str) => {
    const visible = visibleLength(str);
    const leftPad = Math.floor((DESIGN_WIDTH - visible) / 2);
    return padWhole(" ".repeat(Math.max(0, leftPad + 2)) + str);
  };

  return [
    ...composeRow(topLeft, topRight),
    "",
    centerLine(c.bold(centerTitle)),
    centerLine(c.dim("━".repeat(centerTitle.length))),
    "",
    ...composeRow(bottomLeft, bottomRight),
  ].join("\n");
}

const HEADER_ART = renderDomainHeader(
  "AI Engineer",
  ["Deep Learning", "Computer Vision", "LLM Systems", "Probabilistic Modeling"],
  [
    "#7C3AED", // purple
    "#D97706", // orange
    "#16A34A", // green
    "#DB2777", // pink
  ],
);

console.log("\n\n");
console.log(HEADER_ART);
console.log("\n\n");
console.log(
  ww(
    `
Howdy 🖖, this is ${c.hex("#EF4444").bold("Nagasai Vegur")}!

I'm an ${c.bold(
      "AI & ML Engineer",
    )} experimenting intelligent systems that merge analytical rigor with creative design. An innovative individual with zeal for learning something new who enjoys trying out new technologies while listening to 13 exclamations!

`.trim(),
    { width: process.stdout.columns || 80, trim: true },
  ),
);

console.log("\n\n");
iq.prompt([
  {
    type: "list",
    message: "Navigate me?",
    name: "open",
    choices: [
      {
        name: c.hex("#58d77e")(`💻  What am I cooking? (${c.bold("GitHub")})`),
        value: "https://github.com/NSVEGUR",
      },
      {
        name: c.hex("#cc9494")(`🐦  More Me? (${c.bold("Portfolio Site")})`),
        value: "https://nsvegur.me/",
      },
      { name: c.hex("#EF4444")("👋  Nope. Bye.\n"), value: false },
    ],
  },
])
  .then(function (a) {
    open(a.open);
    process.exit();
  })
  .catch(function () {});
