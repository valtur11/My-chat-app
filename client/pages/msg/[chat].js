import Layout from '../../components/Layout';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import configs from '../../config';
const {base_api_url, APP_SERVER_KEY} = configs;

import cookie from 'cookie';
let socket;
export default function Chat({date, messages, loggedInUserId, chatId, chatEmail}) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  useEffect(() =>{
    socket = io(base_api_url.slice(0, -4), {
      query: {
        loggedInUserId
      }
    });
  }, []);
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
    text: '',
    picture: '',
    rows: '1'
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

  function getDayMonthYearString() {
    const date = new Date();
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if(!formData.text && !formData.picture) return;
    //socket.emit('chat', formData.text);
    socket.emit('PM', chatId, formData.text);
    const tmpHis = [...chatHistory];
    if(tmpHis.length===0){
      tmpHis[0] = [getDayMonthYearString(), [{sender: loggedInUserId, text: formData.text, createdAt: Date.parse(new Date())}]];
    } else {
      tmpHis[chatHistory.length-1][1].push({sender: loggedInUserId, text: formData.text, createdAt: Date.parse(new Date())});
    }
    setChatHistory(tmpHis);

    setFormData({ text: '' });
  }

  const askPermission = () => {
    return new Promise((resolve, reject) => {
      const permissionResult = Notification.requestPermission((result) => {
        resolve(result);
      });
      if (permissionResult) {
        permissionResult.then(resolve, reject);
      }
    })
      .then((permissionResult) => {
        if (permissionResult !== 'granted') {
          throw new Error('Permission denied');
        }
      });
  };

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  const sendToServer = (subscription) => {
    console.log(subscription);
    return axios.post('/api/subscription', subscription)
      .then((res) => {
        if (!res.status === 200) {
          throw new Error('An error occurred');
        }
        return res.data;
      })
      .then((resData) => {
        if (!(resData.data && resData.data.success)) {
          throw new Error('An error occurred');
        }
      }).catch(e => console.log(e));
  };

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          askPermission().then(() => {
            const options = {
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(APP_SERVER_KEY)
            };
            return registration.pushManager.subscribe(options);
          })
            .then((pushSubscription) => {
              // we got the pushSubscription object
              const subscription = pushSubscription;
              sendToServer(subscription);
            }); })
        .catch(err => console.error('Service worker registration failed', err));
    } else {
      console.log('Service worker not supported');
    }
  }, []);

  return (
    <Layout date = {date}>
      <h4>You are chatting with {chatEmail}</h4>
      <div style={{background:'repeating-linear-gradient(to bottom right, #D0E90D 10%, #1536F1)'}} className='container-fluid'>
        {chatHistory && chatHistory.map((val, i) => {
          return (<>
            <h6 style={{listStyleType: 'none', color: 'white'}} key ={i}>{val[0]}</h6>
            <br/>
            {val[1].map((msg, i) =>
              <div className ='container justify-content-start' key ={msg._id || i}>
                <div style={{listStyleType: 'none', color: 'white'}} className={msg.sender === loggedInUserId ? 'media flex-wrap' : 'media d-flex flex-wrap'} >
                  <div style={{overflowWrap: 'break-word'}} className={msg.sender === loggedInUserId ? 'bg-primary mw-100' : 'bg-secondary mw-100'} >
                    <p className='px-5 py-1 mw-100'>{msg.text}</p>
                    <small className='pl-5'> {new Date(msg.createdAt).toTimeString().split(' ')[0].substr(0, 5)}</small>
                  </div>
                </div>
              </div>)}
          </>);})
        }

        <h4 className='bg-white'>You are chatting with {chatEmail} {isTyping && (<><span>Typing</span><div className="spinner-grow text-primary" role="status"><span className='sr-only'></span></div></>)}</h4>
        <form className = 'form-inline' onSubmit = {handleSubmit}>
          <textarea
            name = 'text'
            type = 'text'
            rows = {formData.rows}
            cols = '100'
            value={formData.text}
            autoComplete = 'off'
            onChange={handleInputChange}
            onInput={handleInput}
            className='form-control'
            required/>
          <button className='btn btn-primary mx-3' type='submit'>
            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-cursor" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103zM2.25 8.184l3.897 1.67a.5.5 0 0 1 .262.263l1.67 3.897L12.743 3.52 2.25 8.184z"/>
            </svg></button>
        </form>
        <div ref={messagesEndRef} />
      </div>
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  const {req, res} = ctx;
  try {
    let loggedInUserId;
    let messages = [];
    let chatEmail;
    if(!req.headers.cookie) throw new Error('Please, login first!');
    const cookies = cookie.parse(req.headers.cookie);
    if(!cookies.token) throw new Error('Please, login first!');
    const fromUserId = ctx.query.chat; // the route id here (if the route is /msg/3, then ctx.query.chat is 3)
    const options = { headers: { Authorization: `Bearer ${cookies.token}`} };
    //authorize and retrieve all messages of a given user and route id
    await axios.get(`${base_api_url}/messages/${fromUserId}`, options)
      .then(res => {
        loggedInUserId = res.data[0][0];
        chatEmail = res.data[0][1];
        messages = res.data[1];
        console.log(messages);
      })
      .catch((e) => {
        console.log(e);
        //if no auth, then redirect to the signin form.
        throw new Error('Please, login first');
      });
    const date = { currentYear: new Date().getFullYear() };
    return {
      props: {
        date,
        messages,
        loggedInUserId,
        chatId: ctx.query.chat,
        chatEmail
      }
    };
  } catch (e) {
    const date = { currentYear: new Date().getFullYear() };
    console.log(e);
    res.setHeader('location', '/');
    res.statusCode = 302;
    res.end();
    return {props:{messages: [], date, loggedInUserId:'', chatId: ctx.query.chat}};
  }
}

Chat.propTypes = {
  date: PropTypes.object
};