import Layout from '../components/Layout';
import AuthForm from '../components/Authentication';
import axios from 'axios';

export default function Verify ({data}) {
  const resend = () => axios.post('/api/hello?type=resend-verification&method=get').catch(console.log('smth went wrong'));
  return (
    <Layout date = {data}>
      <div className="jumbotron jumbotron-fluid">
        <div className = 'container'>
          <h1>
              Enter the verification code from the email.
          </h1>

          <p className="lead">
          Didn't receive email? <button className='btn btn-primary' onClick={resend}>Resend verification</button>
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