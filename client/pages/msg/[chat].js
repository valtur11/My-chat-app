import Layout from '../../components/Layout';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import configs from '../../config';
const {base_api_url, APP_SERVER_KEY} = configs;

import cookie from 'cookie';
let socket;
export default function Chat({date, messages, loggedInUserId, chatId}) {
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

  function getDayMonthYearString() {
    const date = new Date();
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  }

  function handleSubmit(event) {
    event.preventDefault();
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
      <h1><button className='btn btn-primary' type='button' onClick={askPermission}>Notify me for incoming messages</button></h1>
      <div className='container bg-gradient-primary'>
        {chatHistory && chatHistory.map(val => {
          return (<>
            <h6 style={{listStyleType: 'none', color: 'white'}}>{val[0]}</h6>
            <br/>
            {val[1].map((msg, i) =>
              <div style={{listStyleType: 'none', color: 'white'}} key ={msg._id || i} className={msg.sender === loggedInUserId ? 'media d-flex justify-content-end' : 'media d-flex justify-content-start'} >
                <div style={{}} className={msg.sender === loggedInUserId ? 'bg-primary' : 'bg-secondary'} >
                  {msg.text} | {new Date(msg.createdAt).toTimeString().split(' ')[0].substr(0, 5)}
                </div>
              </div> )}
          </>);})
        }

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
        chatId: ctx.query.chat
      }
    };
  } catch (e) {
    const date = { currentYear: new Date().getFullYear() };
    console.log(e);
    /*res.setHeader('location', '/');
    res.statusCode = 302;
    res.end();*/
    return {props:{messages: [], date, loggedInUserId:'', chatId: ctx.query.chat}};
  }
}

Chat.propTypes = {
  date: PropTypes.object
};