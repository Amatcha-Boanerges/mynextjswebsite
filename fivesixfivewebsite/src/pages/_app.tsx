import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/Layout";
// import { EventsProvider } from "@/context/EventsContext"; // Removed global provider

export default function App({ Component, pageProps }: AppProps) {
  return (
    // <EventsProvider> // Removed
      <Layout>
        <Component {...pageProps} />
      </Layout>
    // </EventsProvider> // Removed
  );
}
