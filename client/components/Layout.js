import Head from 'next/head';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import axios from 'axios';

function Layout({ children, date }) {
  const router = useRouter();

  async function logout() {
    await axios.get('/api/hello?type=logout')
      .then(() => router.push('/'))
      .catch(() => router.push(`${router.pathname}?error=cannot-set-cookie`));
  }

  return (
    <>
      <Head>
        <title>My chat app</title>
        <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'></meta>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>

      <header className = 'sticky-top border-bottom shadow-sm bg-white'>
        <nav className="navbar sticky-top navbar-light bg-light">
          <Link href='/'>
            <a className="navbar-brand"> <img src='/favicon.png' className='img-fluid' width='60' height='auto' /> <img  src='/profile.png' className='img-fluid' width='130' height='30' /> </a>
          </Link>
          <ul className="d-flex flex-row align-baseline mx-md-auto navbar-nav justify-content-center flex-wrap">
            <li className={router.pathname === '/chat' ? 'nav-item active' : 'nav-item'}>
              <Link href='/chat'>
                <button type='button' className='btn btn-primary'>Chat now</button>
              </Link>
            </li>
            <li className='mx-5'>
              <button type='button' className='btn btn-primary' onClick={logout}>Log out</button>
            </li>
          </ul>
        </nav>
      </header>
      <main role = 'main'>
        {children}
      </main>
      <footer className = 'pt-4 my-md-5 pt-md-5 border-top text-muted'>
        <div className = 'container'>
          <p> <a href = '/privacy'> Privacy Policy </a> </p>
          <p> <a href = '/terms'> Terms of Service </a> </p>
          <p><Link href='/faq'><a>FAQ</a></Link></p>
          <p><Link href='/changePassword'><a>Your profile: Change your password</a></Link></p>
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
