import React from "react";
import App from "next/app";
import Head from "next/head";
import { ToastProvider } from '/contexts/toast.jsx'

import "@fortawesome/fontawesome-free/css/all.min.css";
import "/styles/tailwind.css";

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    const Layout = Component.layout || (({ children }) => <>{children}</>);

    return (
      <React.Fragment>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <meta name="referrer" content="strict-origin-when-cross-origin" />
          <title>PERSEA</title>
          <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDDgDN6LjtIYu2Kdz2IDyDad5KMj50JwAM&amp;callback=myMap" async ></script>
        </Head>
        <ToastProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ToastProvider>
      </React.Fragment>
    );
  }
}
