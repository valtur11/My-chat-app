import Layout from '../components/Layout';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import React, { useState, useEffect } from 'react';
const socket = io.connect('http://192.168.1.17:8081');

export default function Chat({data}) {
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
    socket.emit('chat', formData.text);
    setChatHistory([...chatHistory, formData.text]);
    setFormData({ text: '' });
  }

  return (
    <Layout date = {data}>
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

export async function getStaticProps() {
  const data = { currentYear: new Date().getFullYear() };

  return {
    props: {
      data
    }
  };
}

Chat.propTypes = {
  data: PropTypes.object
};