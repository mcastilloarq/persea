const get = async (req, res) => {
  const { query } = req;
  console.log('query', query)
  return res.status(200).json({})
}

const post = async (req, res) => {
  const { body } = req;
  console.log('body', body)
  return res.status(200).json({})
}

export default function handleRequest(req, res) {
  if (req.method === 'GET') {
    return get(req, res);
  } else if (req.method === 'POST') {
    return post(req, res);
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
};
