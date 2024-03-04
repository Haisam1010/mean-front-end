import  {expressjwt}  from "express-jwt";


const jwt = () => {
  const secret = process.env.SECRET
  const api = process.env.API_URL
  return  expressjwt({
        secret,
        algorithms: ['HS256'],
        isRevoked:isRevoked
    }).unless({path: [
        {url:` ${api}/products(.*)/`, methods: ['GET', 'OPTIONS']}, // this is a regular expression
        {url:` ${api}/category(.*)/`, methods: ['GET', 'OPTIONS']}, // this is a regular expression
        `${api}/users/login`,
        `${api}/users/register`
    ]})
}

const isRevoked =  async (req,payload)=>{
    if (!payload.payload.isAdmin) {
        return true; // not admin so cancel request
      }
      return false;
}

export default jwt