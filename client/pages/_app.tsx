import { FC } from "react"
import { Hydrate, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { AppProps } from "next/app"
import { createGlobalStyle, ThemeProvider } from "styled-components"
import { Montserrat } from "@next/font/google"

import { queryClient, theme } from "@core"

const montserrat = Montserrat({ subsets: ["latin"] })

const GlobalStyle = createGlobalStyle`
  html, body, #__next {
    height: 100%;
    margin: 0;
    transition: all 0.2s ease;
    background: #333333;
  }
  
  * {
    outline: none;
  }
  
  .container {
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .container2 {
    position: relative;
    max-width: 1420px;
    margin: 0 auto;
    padding: 0 20px;
  }
`

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <GlobalStyle />
        <ReactQueryDevtools initialIsOpen={false} />
        <ThemeProvider theme={theme}>
          <div className={montserrat.className}>
            <Component {...pageProps} />
          </div>
        </ThemeProvider>
      </Hydrate>
    </QueryClientProvider>
  )
}

export default MyApp
