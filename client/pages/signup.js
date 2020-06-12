import Layout from '../components/Layout';
import AuthForm from '../components/Authentication';

export default function Signup ({data}) {
  return (
    <Layout date = {data}>
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
