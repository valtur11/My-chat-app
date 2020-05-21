import Layout from '../components/Layout'

export default function Home() {
  return (
    <Layout>
        <h1 className="title">
          A new, simple way to chat online
        </h1>

        <p className="description">
        My chat app is a communication platform for people to connect easily.
        </p>
        
        <div className="container">
          <div class="row">
            <div class="col-5">
              <img src='images/chat-app.png' class="card-img"/>
            </div>
            <div class="col-7">
            <img src = 'images/ipad-1721428_1920.jpg' style={{width: '48rem'}}/>
            </div>
            </div>
        </div>
    </Layout>
  )
}
