import Layout from '../components/Layout';
import axios from 'axios';
import useSWR from 'swr';
import {useState} from 'react';
import Link from 'next/link';

export default function Chat ({date}) {
  const fetcher = url => axios.get(url).then(res => res.data);
  const { data, error } = useSWR('/api/friends', fetcher);
  /* useEffect(() => {}, []);*/ //equivalent to componentDidMount
  const [formData, setFormData] = useState({
    email: '',
    errorMessage: '',
    successMessage: ''
  });

  function handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    setFormData({
      ...formData,
      errorMessage: '',
      successMessage: '',
      [name]: value
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    axios.post('/api/friends', { ...formData })
      .then(function (response) {
        console.log('res', response);
        data.push(formData);
        setFormData({
          ...formData,
          errorMessage: '',
          successMessage: { email: formData.email, ...response.data }
        });
      })
      .catch(function (error) {
        console.error(error);
        setFormData({
          ...formData,
          errorMessage: error.response.data.message || 'Something went wrong.',
          successMessage: ''
        });
      });
  }
  return (
    <Layout date={date||{currentYear: 2020}}>
      <h1>List of friends</h1>
      {error &&  <div className='alert alert-danger' role="alert">{ error.response.data.message} <Link href='/'><a>Go back to homepage</a></Link> </div>}
      {Array.isArray(data) && data.length === 0 && <div><span>You dont have any friends in your list yet. Click the Add new friend button below!</span></div>}
      {
        !data && <div className='spinner-border text-primary' role='status'>
          <span className='sr-only'>Loading...</span>
        </div>
      }
      <ul>
        { data && data.map && data.map(friend =>
          <li key={friend._id}><Link href={`/msg/${friend._id}`}><a> {friend.email}</a></Link></li>)
        }
      </ul>

      <form className = 'form-inline' onSubmit = {handleSubmit}>
        {formData.errorMessage && (<div className='alert alert-danger' role="alert">
          {formData.errorMessage}
        </div>)}

        {formData.successMessage && (<div className='alert alert-success' role="alert">
           New friend added whose email is {formData.successMessage.email}
        </div>)}

        <input
          className='form-control'
          placeholder='Email'
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange} />

        <input type="submit" className ='btn btn-primary my-2' value='Add new friend' />
      </form>
    </Layout>
  );
}

export async function getStaticProps() {
  const date = { currentYear: new Date().getFullYear() };

  return {
    props: {
      date
    }
  };
}