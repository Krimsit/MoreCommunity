import tinycolor from "tinycolor2"

import { Theme } from "types/theme"

const theme: Theme = {
  light: "#333333",
  dark: "#252525",
  text: {
    light: "#FFFFFF",
    dark: "#000"
  },
  shadows: {
    light: {
      main: "#3E3E3E",
      outline: "#1E1E1E",
      light: tinycolor("#4D4D4D").setAlpha(25).toHexString()
    },
    dark: {
      main: "#222222",
      outline: "#1C1C1C",
      light: tinycolor("#272727").setAlpha(25).toHexString()
    }
  }
}

export default theme
