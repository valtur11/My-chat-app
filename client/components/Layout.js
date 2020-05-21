function Layout({ children }) {
  return (
    <>
      <header className = 'd-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm'>
      <h5 className="my-0 mr-md-auto font-weight-normal"> <img src="/chat.svg" /> My chat app </h5>
      </header>
      <main role = 'main'>
        <div className = 'container'>
          {children}
        </div>
      </main>
      <footer className = 'pt-4 my-md-5 pt-md-5 border-top text-muted'>
        <div className = 'container'>
          <p> <a href = '#'> Privacy Policy </a> </p>
          <p> <a href = '#'> Terms of Service </a> </p>
          <p> &copy; 2020 My chat app. Created by <a href = 'https://valentinratchev.com'> Valentin Ratchev </a> </p>
        </div>
      </footer>
    </>
  )
}

export default Layout
