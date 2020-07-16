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
        res.json(error);
        console.error(error.message);
      });
  } else if(req.method === 'POST') {
    await axios.post(`${base_api_url}/friends`, req.body, options)
      .then(function (response) {
        return res.status(200).json(response.data);
      })
      .catch(function (error) {
        res.json(error);
        console.error(error.message);
      });
  }
};