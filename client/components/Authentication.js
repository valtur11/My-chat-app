import React, { useState } from 'react';
import axios from 'axios';
const base_api_url = 'http://localhost:8081/api';
import PropTypes from 'prop-types';
import Link from 'next/link';

function AuthForm ({ type }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    isPasswordHidden: true,
    errorMessage: '',
    successMessage: ''
  });
  const authType = type.charAt(0).toUpperCase() + type.slice(1);

  function handleInputChange(event) {
    const target = event.target;
    const value = target.name === 'isPasswordHidden' ? !target.checked : target.value;
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
    axios.post(`${base_api_url}/${type}`, { ...formData })
      .then(function (response) {
        console.log('res', response);
        setFormData({
          ...formData,
          errorMessage: '',
          successMessage: response.data
        });
      })
      .catch(function (error) {
        console.error(error);
        setFormData({
          ...formData,
          errorMessage: error.message || 'Something went wrong.',
          successMessage: ''
        });
      });
  }

  return (
    <>
      <form className = 'container' onSubmit = {handleSubmit}>
        {formData.errorMessage && (<div className='alert alert-danger' role="alert">
          {formData.errorMessage}
        </div>)}

        {formData.successMessage && (<div className='alert alert-success' role="alert">
          {authType} successful. Email: {formData.successMessage.email}
        </div>)}

        <div className='form-group'>
          <label>Email</label>
          <input
            className='form-control'
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange} />
        </div>

        <div className='form-group'>
          <label>Password</label>

          <div className='input-group'>
            <input
              className='form-control'
              name="password"
              type={formData.isPasswordHidden ? 'password' : 'text'}
              value={formData.password}
              onChange={handleInputChange} />

            <div className="input-group-append">
              <div className="input-group-text">
                <span className='mx-1'>
                  Show
                </span>
                <input
                  name='isPasswordHidden'
                  type="checkbox"
                  checked={!formData.isPasswordHidden}
                  onChange={handleInputChange} />
              </div>
            </div>
          </div>

          { type === 'login' && (<p className='text-muted'><a href="#">Forgot your password?</a></p>)}
        </div>

        <input type="submit" className ='btn btn-primary my-2' value={authType} />

        {
          type === 'login' ? (
            <p className='text-muted'>Need an account? <Link href='/signup'><a> Sign up </a></Link></p>
          ) : (<p className='text-muted'>Already have an account? <Link href='/'><a> Login </a></Link></p>)
        }
      </form>
    </>
  );
}

AuthForm.propTypes = {
  type: PropTypes.string
};

export default AuthForm;