// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import configs from '../../config';
const {base_api_url} = configs;
import axios from 'axios';
import { serialize } from 'cookie';
//use webserver for everything
export default async (req, res) => {
  const type = req.query.type;
  //then set the auth header from the cookie
  console.log(req.cookies.token);
  await axios.post(`${base_api_url}/${type}`, req.body)
    .then(function (response) {
      res.setHeader('Set-Cookie', serialize('token', response.data.token, { path: '/', httpOnly: true }));
      return res.status(200).json(response.data);
    })
    .catch(function (error) {
      res.status(error.response.status).json(error.response.data);
      console.error(error.response.data);
    });
};
