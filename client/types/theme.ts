export interface Theme {
  light: string
  dark: string
  text: {
    light: string
    dark: string
  }
  shadows: {
    light: {
      main: string
      outline: string
      light: string
    }
    dark: {
      main: string
      outline: string
      light: string
    }
  }
}
