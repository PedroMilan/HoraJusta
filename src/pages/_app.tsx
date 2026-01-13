import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>HoraJusta | Controle simples de horas trabalhadas</title>

        <meta
          name="description"
          content="HoraJusta é uma aplicação simples para controle de horas trabalhadas, ideal para freelancers, PJs e profissionais remotos que desejam saber exatamente quanto vale o seu tempo."
        />

        <meta
          name="keywords"
          content="controle de horas, horas trabalhadas, freelancer, produtividade, time tracking, React, Next.js, TypeScript"
        />

        <meta name="author" content="Pedro Milan" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="icon" href="/favicon.png" />

        {/* Open Graph / LinkedIn */}
        <meta
          property="og:title"
          content="HoraJusta | Trabalhe sabendo quanto vale o seu tempo"
        />
        <meta
          property="og:description"
          content="Controle suas horas de trabalho de forma simples e tenha clareza sobre produtividade e valor do seu tempo. Projeto desenvolvido em React e Next.js."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://SEU-PROJETO.vercel.app" />
        <meta
          property="og:image"
          content="https://SEU-PROJETO.vercel.app/og-image.png"
        />
        <meta property="og:site_name" content="HoraJusta" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="HoraJusta | Controle de horas trabalhadas"
        />
        <meta
          name="twitter:description"
          content="Uma solução simples para freelancers e profissionais remotos controlarem horas e produtividade."
        />
        <meta
          name="twitter:image"
          content="https://SEU-PROJETO.vercel.app/og-image.png"
        />
      </Head>

      <Component {...pageProps} />
    </>
  );
}
