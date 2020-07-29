import configs from '../../config';
const {base_api_url} = configs;
import axios from 'axios';
export default async (req, res) => {
  const options = { headers: { Authorization: `Bearer ${req.cookies.token||''}`} };
  await axios.post(`${base_api_url}/subscription`, req.body, options)
    .then(function (response) {
      return res.status(200).json(response.data);
    })
    .catch(function (error) {
      console.log(error.response.data.error);
      const status = (error && error.response) ? error.response.status : 500;
      const data = (error && error.response) ? error.response.data.error : {};
      res.status(status).json(data);
    });
};
