import Layout from '../../components/Layout';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import configs from '../../config';
const {base_api_url} = configs;
import cookie from 'cookie';
let socket;
export default function Chat({date, messages, loggedInUserId, chatId}) {
  useEffect(() =>{
    socket = io(base_api_url.substr(0,24), {
      query: {
        loggedInUserId
      }
    });
  }, []);
  console.log(loggedInUserId);
  useEffect(()=>{
    socket.on('typing', () => {
      setTyping(true);
      setTyping(false);
    });

    socket.on('PM', obj => {
      setChatHistory([...chatHistory, obj]);
      console.log(chatHistory);
    });
    socket.on('error', (error) => {
      console.log(error);
    });
  });
  const [formData, setFormData] = useState({
    text: ''
  });
  const [chatHistory, setChatHistory] = useState(messages);
  const [isTyping, setTyping] = useState(false);

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
    socket.emit('PM', chatId, formData.text);
    setChatHistory([...chatHistory, {sender: loggedInUserId, text: formData.text, createdAt: Date.parse(new Date())}]);

    setFormData({ text: '' });
  }

  return (
    <Layout date = {date}>
      <h1>{}</h1>
      <div className='container bg-gradient-secondary'>
        {chatHistory.map((msg, i) =>
          <div style={{listStyleType: 'none', color: 'white'}} key ={Date.parse(msg.createdAt) || i} className={msg.sender === loggedInUserId ? 'media d-flex justify-content-end' : 'media d-flex justify-content-start'} >
            <div style={{}} className={msg.sender === loggedInUserId ? 'bg-primary' : 'bg-secondary'} >
              {msg.text} | {new Date(msg.createdAt).toTimeString().split(' ')[0].substr(0, 5)}
            </div>
          </div> )}

        <form className = 'form-inline' onSubmit = {handleSubmit}>
          <input
            name = 'text'
            type = 'text'
            value={formData.text}
            autoComplete = 'off'
            onChange={handleInputChange}
            onInput={handleInput}
            className='form-control'
            required/>
          <button className='btn btn-primary' type='submit'>Send</button>
          {isTyping && (<><span>Typing</span><div className="spinner-grow text-primary" role="status"><span className='sr-only'></span></div></>)}
        </form>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  const {req, res} = ctx;
  try {
    let loggedInUserId;
    let messages = [];
    if(!req.headers.cookie) throw new Error('Please, login first!');
    const cookies = cookie.parse(req.headers.cookie);
    if(!cookies.token) throw new Error('Please, login first!');
    const fromUserId = ctx.query.chat; // the route id here (if the route is /msg/3, then ctx.query.chat is 3)
    const options = { headers: { Authorization: `Bearer ${cookies.token}`} };
    //authorize and retrieve all messages of a given user and route id
    await axios.get(`${base_api_url}/messages/${fromUserId}`, options)
      .then(res => {
        loggedInUserId = res.data[0];
        messages = res.data[1];
      })
      .catch(() => {
        //if no auth, then redirect to the signin form.
        throw new Error('Please, login first');
      });
    const date = { currentYear: new Date().getFullYear() };
    return {
      props: {
        date,
        messages,
        loggedInUserId,
        chatId: ctx.query.chat
      }
    };
  } catch (e) {
    res.setHeader('location', '/');
    res.statusCode = 302;
    res.end();
    return {props:{}};
  }
}

Chat.propTypes = {
  date: PropTypes.object
};