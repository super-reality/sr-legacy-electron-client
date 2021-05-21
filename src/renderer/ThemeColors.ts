/* eslint-disable guard-for-in */
export type Theme = Record<string, string>;
export interface Themes {
  [x: string]: Theme;
}
export const themes: Themes = {
  dark: {
    colorBackground: "#202225",
    colorBackgroundDark: "#1b1f33",
    colorSection:
      "linear-gradient(180deg, #353358 0%, #302d4d 43.89%, #29233b 100%)",
    mainGradient:
      "linear-gradient(180deg, #29233c 0%, #353459 40.2%, #261f34 100%)",

    colorRainbow:
      "linear-gradient(270deg, #ffffff 0%, #feb666 14.2%, #fe923d 26.8%, #fb4256 47.3%, #a7258a 64%, #0d4ee4 77.8%, #06abed 93.7%, #ffffff 100%)",

    colorLessRainbow:
      "linear-gradient(90.79deg, #fa255a -1.12%, #8c2799 44.72%, #0f32e1 99.41%)",

    colorButton: "#29233c",
    colorButtonHover: "#585286",
    colorText: "#bbbbbb",
    colorTextActive: "#c2c2c2",
    colorIcon: " #a8abaf",

    colorChecked: "#43b581",
    colorGreen: "#43b581",
    colorMagenda: "#9391ce",
    colorRed: "#f04747",
    colorBlue: "#04aff0",
    colorPink: "#d232b5",
    colorCyan: "#00fef6",
    colorWhite: "#fff",
    colorLight: "#a8a8c9",

    colorSectionSeparator: "#393c43",
    colorSectionSeparatorHover: "#43464e",

    colorSectionHover: "#444e58",
    colorSectionInnerHover: "#393c40",
    colorBackgroundHover: "#3f3e6f",
    colorTextDisabled: "#808284",
    colorTextDark: "#242526",
    colorSeparator: "#6f6f6f",
  },
  light: {
    colorBackground: "#FFFFFF",
    colorBackgroundDark: "#bbb",
    colorSection:
      "linear-gradient(180deg, #353358 0%, #302d4d 43.89%, #29233b 100%)",
    mainGradient:
      "linear-gradient(180deg, #29233c 0%, #353459 40.2%, #261f34 100%)",

    colorRainbow:
      "linear-gradient(270deg, #ffffff 0%, #feb666 14.2%, #fe923d 26.8%, #fb4256 47.3%, #a7258a 64%, #0d4ee4 77.8%, #06abed 93.7%, #ffffff 100%)",

    colorLessRainbow:
      "linear-gradient(90.79deg, #fa255a -1.12%, #8c2799 44.72%, #0f32e1 99.41%)",

    colorButton: "#29233c",
    colorButtonHover: "#585286",
    colorText: "#bbbbbb",
    colorTextActive: "#c2c2c2",
    colorIcon: " #a8abaf",

    colorChecked: "#43b581",
    colorGreen: "#43b581",
    colorMagenda: "#9391ce",
    colorRed: "#f04747",
    colorBlue: "#04aff0",
    colorPink: "#d232b5",
    colorCyan: "#00fef6",
    colorWhite: "#fff",
    colorLight: "#a8a8c9",

    colorSectionSeparator: "#393c43",
    colorSectionSeparatorHover: "#43464e",

    colorSectionHover: "#444e58",
    colorSectionInnerHover: "#393c40",
    colorBackgroundHover: "#3f3e6f",
    colorTextDisabled: "#808284",
    colorTextDark: "#242526",
    colorSeparator: "#6f6f6f",
  },
};

// function to modify colorBackground in color-background
function styleHyphenFormat(propertyName: string) {
  function upperToHyphenLower(match: string, offset: number) {
    return (offset > 0 ? "-" : "") + match.toLowerCase();
  }
  return propertyName.replace(/[A-Z]/g, upperToHyphenLower);
}
// function to set the new Theme colors to the :root

export const setCSSVariables = (theme: Theme) => {
  console.log("setCSSVariables theme", theme);
  let newValue = "";
  // eslint-disable-next-line no-restricted-syntax

  //   for (const value in theme) {
  //     newValue = styleHyphenFormat(value);
  //     console.log("setCSSVariables theme", theme, "value", `--${newValue}`);
  //     document.documentElement.style.setProperty(`--${newValue}`, theme[value]);
  //   }

  Object.keys(theme).forEach((value) => {
    newValue = styleHyphenFormat(value);
    console.log("setCSSVariables theme", theme, "value", `--${newValue}`);
  });
};
