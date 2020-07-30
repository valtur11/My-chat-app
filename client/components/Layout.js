import Head from 'next/head';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

function Layout({ children, date }) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>My chat app</title>
        <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'></meta>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>

      <header className = 'border-bottom shadow-sm bg-white'>
        <nav className="navbar sticky-top navbar-light bg-light">
          <Link href='/'>
            <a className="navbar-brand"> <img src='/favicon.png' className='img-fluid' width='60' height='auto' /> <img  src='/profile.png' className='img-fluid' width='130' height='30' /> </a>
          </Link>
          <ul className="d-md-flex d-block flex-row mx-md-auto mx-0 navbar-nav">
            <li className={router.pathname === '/chat' ? 'nav-item active' : 'nav-item'}>
              <Link href='/chat'>
                <a className='nav-link'><button className='btn btn-primary btn-large'>Chat now</button></a>
              </Link>

            </li>
          </ul>
        </nav>
      </header>
      <main role = 'main'>
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
