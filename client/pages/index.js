import Head from 'next/head'
import Layout from '../components/Layout'

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

        <h1 className="title">
          A new, simple way to chat online
        </h1>

        <p className="description">
        My chat app is a communication platform for people to connect easily.
        </p>
        
        <div className="container">
         <img  class="img-fluid" src = '/images/chat-app.png' />
        </div>
    </Layout>
  )
}
