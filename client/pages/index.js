import Layout from '../components/Layout';
import PropTypes from 'prop-types';

export default function Home({data}) {
  return (
    <Layout date = {data}>
      <div className="jumbotron jumbotron-fluid">
        <div className = 'container'>
          <h1>
              A new, simple way to chat online
          </h1>

          <p className="lead">
            My chat app is a communication platform for people to connect easily.
          </p>
        </div>
      </div>

      <div className = 'container'>
        <div className="my-5">
          <div className="row">
            <div className="col-5">
              <img src='images/chat-app.png' className="card-img"/>
            </div>
            <div className="col-7">
              <img src = 'images/ipad-1721428_1920.jpg' className = 'w-100'/>
            </div>
          </div>
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

Home.propTypes = {
  data: PropTypes.object
};
