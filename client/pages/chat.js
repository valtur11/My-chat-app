import Layout from '../components/Layout';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import React, { useState, useEffect } from 'react';
const socket = io.connect('http://192.168.1.17:8081');

export default function Chat({data}) {
  const [formData, setFormData] = useState({
    text: '',
    chatHistory: []
  });

  socket.on('chat1', text => {
    setFormData({
      ...formData,
      chatHistory: [text]
    });
  });

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
    socket.emit('chat2', formData.text);
    setFormData({
      chatHistory: [],
      text: ''
    });//*/
  }

  return (
    <Layout date = {data}>
      <ul>
        {formData.chatHistory.map((text, i) =>
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
          onChange={handleInputChange} />
        <button type='submit'>Send</button>
      </form>
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