import Layout from '../components/Layout';
import AuthForm from '../components/Authentication';

export default function Signup ({data}) {
  return (
    <Layout date = {data}>
      <div className="jumbotron jumbotron-fluid">
        <div className = 'container'>
          <h1>
              Change your password
          </h1>

          <p className="lead">
            Changing your password often is considered a good practice.
          </p>
        </div>
      </div>

      <AuthForm type='change-password'/>
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