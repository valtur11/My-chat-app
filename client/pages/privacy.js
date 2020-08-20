import Layout from '../components/Layout';

export default function Signup ({data}) {
  return (
    <Layout date = {data}>
      <div className="jumbotron jumbotron-fluid">
        <div className = 'container'>
          <h1>
              Privacy Policy
          </h1>

          <p className="lead">
            My chat app is a communication platform for people to connect easily.
          </p>
        </div>
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