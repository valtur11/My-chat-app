import Head from 'next/head';
import Link from 'next/link';
import PropTypes from 'prop-types';

function Layout({ children, date }) {
  return (
    <>
      <Head>
        <title>My chat app</title>
        <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'></meta>
        <link rel='icon' href='favicon.ico' />
      </Head>

      <header className = 'sticky-top align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm'>
        <h5 className='my-0 mr-md-auto font-weight-normal'>
          <Link href='/'>
            <a style = {{textDecoration: 'none'}}> <img src='/chat.svg' style = {{padding: '0 1rem 0 1rem'}}/> My chat app </a>
          </Link>
        </h5>

      </header>
      <main role = 'main'>
        {children}
      </main>
      <footer className = 'pt-4 my-md-5 pt-md-5 border-top text-muted'>
        <div className = 'container'>
          <p> <a href = '#'> Privacy Policy </a> </p>
          <p> <a href = '#'> Terms of Service </a> </p>
          <p> &copy; {date.currentYear} My chat app. Created by <a href = 'https://valentinratchev.com'> Valentin Ratchev </a> </p>
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
