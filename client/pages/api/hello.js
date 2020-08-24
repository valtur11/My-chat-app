// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import configs from '../../config';
const {base_api_url} = configs;
import axios from 'axios';
import { serialize } from 'cookie';
//use webserver for everything
export default async (req, res) => {
  const type = req.query.type;
  const method = req.query.method || 'post';
  if (type === 'logout')  {
    try {
      res.setHeader('Set-Cookie','token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; maxAge=0');
      return res.status(200).json({message: 'Logged out.'});
    } catch (e){
      return res.status(500).json({error: { status: 500, code: 'cannot-set-cookies', message: 'Can\'t logout'}});
    }
  }
  const options = { headers: { Authorization: `Bearer ${req.cookies.token||''}`} };
  const args = [req.body, options];
  if(method === 'get') args.shift();
  //then set the auth header from the cookie
  await axios[method](`${base_api_url}/${type}`, ...args)
    .then(function (response) {
      const cookieOptions = { path: '/', secure: true, httpOnly: true, maxAge: (7200-120), expires: new Date(Date.parse()+7080000), sameSite: 'strict'};
      if(process.env.NODE_ENV === 'development') delete cookieOptions.secure; //Enable cookies for local network bulds
      if(type === 'login' || type === 'signup') res.setHeader('Set-Cookie', serialize('token', response.data.token, cookieOptions));
      return res.status(200).json(response.data);
    })
    .catch(function (error) {
      const status = (error && error.response) ? error.response.status : 500;
      const data = (error && error.response) ? error.response.data.error : {};
      res.status(status).json(data);
    });
};
