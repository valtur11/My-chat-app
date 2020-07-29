// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import configs from '../../config';
const {base_api_url} = configs;
import axios from 'axios';
import { serialize } from 'cookie';
//use webserver for everything
export default async (req, res) => {
  const type = req.query.type;
  //then set the auth header from the cookie
  await axios.post(`${base_api_url}/${type}`, req.body, {headers: {Authorization: req.cookies.token || ''}})
    .then(function (response) {
      res.setHeader('Set-Cookie', serialize('token', response.data.token, { path: '/', httpOnly: true, maxAge: 240 }));
      return res.status(200).json(response.data);
    })
    .catch(function (error) {
      const status = (error && error.response) ? error.response.status : 500;
      const data = (error && error.response) ? error.response.data.error : {};
      res.status(status).json(data);
    });
};
