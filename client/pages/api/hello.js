// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import configs from '../../config';
const {base_api_url} = configs;
import axios from 'axios';
import { serialize } from 'cookie';
//use webserver for everything
export default async (req, res) => {
  const type = req.query.type;
  if (type === 'logout')  {
    try {
      res.setHeader('Set-Cookie', serialize('token', req.cookies.token, { path: '/', httpOnly: true, maxAge: 0, sameSite: 'strict', secure: 'true'}));
      return res.status(200).json({message: 'Logged out.'});
    } catch (e){
      return res.status(500).json({error: { status: 500, code: 'cannot-set-cookies', message: 'Can\'t logout'}});
    }
  }
  const options = { headers: { Authorization: `Bearer ${req.cookies.token||''}`} };
  //then set the auth header from the cookie
  await axios.post(`${base_api_url}/${type}`, req.body, options)
    .then(function (response) {
      res.setHeader('Set-Cookie', serialize('token', response.data.token, { path: '/', httpOnly: true, maxAge: 240, sameSite: 'strict'}));
      return res.status(200).json(response.data);
    })
    .catch(function (error) {
      const status = (error && error.response) ? error.response.status : 500;
      const data = (error && error.response) ? error.response.data.error : {};
      res.status(status).json(data);
    });
};
