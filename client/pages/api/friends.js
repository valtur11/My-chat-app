import configs from '../../config';
const {base_api_url} = configs;
import axios from 'axios';

export default async (req, res) => {
  const options = { headers: { Authorization: `Bearer ${req.cookies.token}`} };
  if(req.method === 'GET'){
    await axios.get(`${base_api_url}/friends`, options)
      .then(function (response) {
        return res.status(200).json(response.data);
      })
      .catch(function (error) {
        const status = (error && error.response) ? error.response.status : 500;
        const data = (error && error.response) ? error.response.data.error : {};
        if(error.response.data.error.code === 'session-expired') data.message = 'Session expired. Please, login again.';
        res.status(status).json(data);
      });
  } else if(req.method === 'POST') {
    await axios.post(`${base_api_url}/friends`, req.body, options)
      .then(function (response) {
        return res.status(200).json(response.data);
      })
      .catch(function (error) {
        res.status(error.response.status).json(error.response.data.error);
      });
  }
};