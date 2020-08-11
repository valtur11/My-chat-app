import configs from '../../config';
const {base_api_url} = configs;
import axios from 'axios';

export default async (req, res) => {
  const type = req.query.type;
  const id = req.body.id;
  const options = { headers: { Authorization: `Bearer ${req.cookies.token}`} };
  if(req.method === 'POST'){
    await axios.get(`${base_api_url}/${type}/${id}`, options)
      .then(function (response) {
        console.log('200');
        return res.status(200).json({message: `(un)${type}ed successfully.`});
      })
      .catch(function (error) {
        const status = (error && error.response) ? error.response.status : 500;
        const data = (error && error.response) ? error.response.data.error : {};
        if(error.response.data.error.code === 'session-expired') data.message = 'Session expired. Please, login again.';
        res.status(status).json(data);
      });
  }
};