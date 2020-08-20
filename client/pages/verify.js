import Layout from '../components/Layout';
import AuthForm from '../components/Authentication';

export default function Verify ({data}) {
  return (
    <Layout date = {data}>
      <div className="jumbotron jumbotron-fluid">
        <div className = 'container'>
          <h1>
              Enter the veficication code from the email.
          </h1>

          <p className="lead">
          Didn't receive email? <a href='#'>Resend verification</a>
          </p>
        </div>
      </div>

      <AuthForm type='verify'/>
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