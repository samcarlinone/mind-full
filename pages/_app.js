import Head from 'next/head'
import '../styles/globals.css'

const App = ({ Component, pageProps }) => (
  <>
    <Head>
      <meta name="description" content="Mind-Full: A word search game." />
      <meta name="keywords" content="word search, word, words, search, game, mindfull, mind, full" />
      <title>Mind-Full</title>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
      />
      <link rel="manifest" href="/manifest.json" />
      <link
        href="/icons/icon-16x16.png"
        rel="icon"
        type="image/png"
        sizes="16x16"
      />
      <link
        href="/icons/icon-32x32.png"
        rel="icon"
        type="image/png"
        sizes="32x32"
      />
      <link rel="apple-touch-icon" href="/apple-icon.png"></link>
      <meta name="theme-color" content="#130303" />
    </Head>
    <Component {...pageProps} />
  </>
)

export default App
