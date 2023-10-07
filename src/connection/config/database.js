var mysql = require('mysql');

var connections = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'college'
  });
  
  connections.query(function (error) {
    if (!!error) {
      const data = "select * from 	user_role";
      connections.query(data, function (error, result) {
        console.log(result)
      })
    } else {
     console.log(error, 'Error')
    }
  });

  module.exports = connections