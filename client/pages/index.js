import Layout from '../components/Layout'

export default function Home() {
  return (
    <Layout>
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
  )
}
