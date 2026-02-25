#!/usr/bin/env node
"use strict";

import c from "chalk";
import ww from "word-wrap";
import iq from "inquirer";
import open from "open";

function gradientText(text, startColor, endColor) {
  const lines = text.split("\n");

  const interpolate = (start, end, factor) =>
    Math.round(start + (end - start) * factor);

  const parseHex = (hex) =>
    hex.replace("#", "").match(/.{1,2}/g).map((x) => parseInt(x, 16));

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

// ASCII portrait generated from image.png
const ASCII_ART = `
;;;;;;;;;;;;+++;::::::::::;+*+;:;;;;;;;++++++;;+*?*+++;;;++*
;;;;;;;;;;;;+++;::::::;*%SSS#SSSSS%?+;::::::::::+**+;;;;+++*
++;;;;+;;;;;+*++;;;;?S#@@@@##@@@@@@@S?;:,,,,,,,:;*++;;::;;++
+++++++++++++*+;:::?@@@@@@@@@@@#@@@@###+.,,,,,,,;*+;:::::;;+
++++++;;:::;;;:,,.,#@@@@#%???*++*?S####*,,,,,,,:;*+;;;;;;;;+
:::::;;:::::;;:,...S@@#%?*++;;;;+**S@@S:.......,:*+;;:::::;+
,,,,:::::::::;:,...+@S?%%%%?*+**???%@#:.........:+;:,,:::,:;
,,,,,:::,,,,:::,...:#??%%%%%?*%SSS%?S+ ........,:+:..,,,...,
,,,,,::,,,,,,::,...,%%*++***++**+**?*..........,:+:,,:;:,,:;
,,,,,::,,,,,,::,....+%??%#SS%%%%%**%:..........,:+;:::;;;;;;
,,,,,::,,,,,,::,,,,,.?%?%S%***?%S%%+........,,,,:++++++++;;;
,,,,,::,,,,,,::,,,,.,*#S%????**??%;......,,,,,,,:++++++++;;+
::;;;;;;:::,:::,...;%;%#@#S%%%S##*;,,.......,,,,:++;;;;;;;;+
*****+++;;;;:;;+*?S#@+,*%#@####%;,S#%%?*;;:,,...:;;;:::;;;;+
*****+;:;+**?%S#@@@###:,,:;*??:..:S#######SS%?*+++;::::::;;;
*++;+**?%S###########@%,,:*%SS%*,:################%;:;;;;;;+
**+%##################@+,;%###?;::S################%+++++++*
%%%####################S,..*##*..,S#################?+++++**
#SS####################@?,,?#S#*.,S##################*****??
#SS######@###############;,?#SSS,,S##################S****?%
SS########@##############%,?#SSS+,S###################%**??*
*%########@@##############;*#SSS?,%#############@######*++++
*S@#######@@@#############%+#SSSS,?@############@######%++;; 
+S@########@@@########@####*SSSS#;*@###########@@@######****
+S@########@@@@########@###SS#SS#**@#########@@@@#######%++*
+S@#######@@@@@@@@@##@##@########%*@##@######@@@@@@#####S+++
+S@##@@@@@##@@@@@@@@@@@#@@##@####S?###@@####@@@@@@@@@@@##?++
`.trim();

console.log("\n\n");
console.log(gradientText(ASCII_ART, "#EF4444", "#cc9494"));
console.log("\n\n");
console.log(
  ww(
    `
Howdy 🖖🏻, this is ${c.hex("#EF4444").bold("Nagasai Vegur")}!

I'm an ${c.bgHex("#cc9494").black.bold(
      "AI & ML Engineer"
    )} experimenting intelligent systems that merge analytical rigor with creative design. An innovative individual with zeal for learning something new who enjoys trying out new technologies while listening to ${c
      .hex("#EF4444")
      .bold("13 exclamations")}!

`.trim(),
    { width: process.stdout.columns || 80, trim: true }
  )
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
