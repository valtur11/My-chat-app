import Layout from '../components/Layout';

export default function Signup ({data}) {
  return (
    <Layout date = {data}>
      <div className="jumbotron jumbotron-fluid">
        <div className = 'container'>
          <h1>
             FAQ
          </h1>

          <p className="lead">
            My chat app is a communication platform for people to connect easily.
          </p>
        </div>
      </div>
      <div className='container'>
        <h3>Common questions and their answers</h3>
        <p>
        I tried to get all my chats but got Session expired message. What should I do?
          <p>After login(or signup) you have new session expiring in 2 hours. Afrer the session is expired, login again.</p>
        </p>
        <p>
        Got message 'Already logged in' but neither I can't login, nor view my chats.
          <p>Try logging out and then login again. If this doesn't work, then try another browser, clear cookies and site settings, or browse using incognito.</p>
        </p>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const data = { currentYear: new Date().getFullYear() };

  return {
    props: {
      data
    }
  };
}