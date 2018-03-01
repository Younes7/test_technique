if(process.env.NODE_ENV === 'production'){
  module.exports = { mongoURI:'mongodb://younes:1234@ds251988.mlab.com:51988/testlogin'}
} else {
  module.exports = { mongoURI:'mongodb://localhost/testlogin'}
}