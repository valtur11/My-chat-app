import Layout from '../../components/Layout';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import React, { useState } from 'react';
import axios from 'axios';
import configs from '../../config';
const {base_api_url} = configs;
import { useRouter } from 'next/router';
import cookie from 'cookie';

export default function Chat({date}) {
  let jwtToken;
  // if(typeof window !== 'undefined') jwtToken = localStorage.getItem('token') || 'no-token';
  const socket = io('http://192.168.1.17:8081');//http://192.168.1.17:8081?jwtToken
  const [formData, setFormData] = useState({
    text: ''
  });
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setTyping] = useState(false);

  socket.on('chat', text => {
    setChatHistory([...chatHistory, text]);
    socket.on('typing', () => {
      setTyping(true);
      setTimeout(() => setTyping(false), 1000);
    });
  });

  socket.on('error', (error) => {
    setChatHistory([...chatHistory, error]);
  });

  function handleInput () {
    socket.emit('typing');
  }
  function handleInputChange(event) {
    const target = event.target;
    const value = target.name === 'isPasswordHidden' ? !target.checked : target.value;
    const name = target.name;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    //socket.emit('chat', formData.text);
    socket.emit('PM', 'authuser', formData.text);
    setChatHistory([...chatHistory, formData.text]);
    setFormData({ text: '' });
  }

  return (
    <Layout date = {date}>
      <h1>{}</h1>
      <ul>
        {chatHistory.map((text, i) =>
          <li style={{listStyleType: 'none'}} key ={i}>
            {text}
          </li>
        )}
      </ul>

      <form className = 'container' onSubmit = {handleSubmit}>
        <input
          name = 'text'
          type = 'text'
          value={formData.text}
          autoComplete = 'off'
          onChange={handleInputChange}
          onInput={handleInput} />
        <button type='submit'>Send</button>
      </form>

      {isTyping && (<p className='text-muted'>Someone is typing...</p>)}
    </Layout>
  );
}

export async function getServerSideProps(req) {
  const cookies = cookie.parse(req.req.headers.cookie);
  const ofUserId = '1t3789043487'; //the logged in user id.
  const fromUserId = req.query.chat; // the route id here
  const options = { headers: { Authorization: `Bearer ${cookies.token}`} };
  axios.get(`${base_api_url}/messages/${ofUserId}?fromUserId=${fromUserId}`, options)
    .then(res => {console.log('200'); console.log(res.data)})
    //if no auth, then redirect to the signin form.
    .catch(err => {console.log('err', err.message);});
  //retrieve all messages of a given user and route id, then auhtorize
  const date = { currentYear: new Date().getFullYear() };
  return {
    props: {
      date,
      id: 10,
      messages: [{text: 'LoL'}]
    }
  };
}

Chat.propTypes = {
  date: PropTypes.object
};