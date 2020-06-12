import Layout from '../components/Layout';
import AuthForm from '../components/Authentication';

export default function Signup ({data}) {
  return (
    <Layout date = {data}>
      <div className="jumbotron jumbotron-fluid">
        <div className = 'container'>
          <h1>
              Signup
          </h1>

          <p className="lead">
            My chat app is a communication platform for people to connect easily.
          </p>
        </div>
      </div>

      <AuthForm type='signup'/>
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
