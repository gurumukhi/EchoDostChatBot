// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'

export default async function handler (req, res) {
  
  console.log('reached api call handler');
  
  const referer = req.headers.referer || req.headers.referrer // get the referer from the request headers

  if (req.method !== 'POST') {
          console.log('1');
    res.status(405).json({ message: 'Method should be POST' })
  } else if (process.env.NODE_ENV !== 'development') {
    console.log('2');
    if (!referer || referer !== process.env.APP_URL) {
      console.log('3');
      res.status(401).json({ message: 'Unauthorized' })
    }
  } else {
    console.log('4');
    try {
      console.log('5');
      const { body } = req
      const url = 'https://api.openai.com/v1/chat/completions'
      const headers = {
        'Content-type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      }
      console.log('6');
      console.log('hitting api');
      const response = await axios.post(url, body, { headers: headers })
console.log('7');
      res.status(200).json(response.data)
      console.log('8');
    } catch (error)  {
console.log('9');
      console.log(error)
      res.status(500).json({ message: 'Something went wrong' })
    }
    console.log('10');
  }
  console.log('11');
}
