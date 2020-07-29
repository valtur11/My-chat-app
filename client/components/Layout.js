import Head from 'next/head';
import Link from 'next/link';
import PropTypes from 'prop-types';

function Layout({ children, date }) {
  return (
    <>
      <Head>
        <title>My chat app</title>
        <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'></meta>
        <link rel='icon' href='/favicon.png' />
      </Head>

      <header className = 'sticky-top bg-white border-bottom shadow-sm'>
        <nav className="navbar navbar-light bg-light">
          <Link className="navbar-brand" href='/'>
            <a> <img  src='/favicon.png' className='img-fluid' width='60' height='auto' /> <img  src='/profile.png' className='img-fluid' width='130' height='30' /> </a>
          </Link>
        </nav>
      </header>
      <main role = 'main'>
        <Link href='/chat'>
          <a><button className='btn btn-primary btn-large'>Chat now</button></a>
        </Link>
        {children}
      </main>
      <footer className = 'pt-4 my-md-5 pt-md-5 border-top text-muted'>
        <div className = 'container'>
          <p> <a href = '#'> Privacy Policy </a> </p>
          <p> <a href = '#'> Terms of Service </a> </p>
          <p> &copy; {date.currentYear} <img  src='/profile.png' className='img-fluid' width='130' height='30' /> Created by <a href = 'https://valentinratchev.com'> Valentin Ratchev </a> </p>
        </div>
      </footer>
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.array,
  date: PropTypes.object
};

export default Layout;
