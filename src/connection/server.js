const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



const db = require('../connection/config/database');
console.log(db, 'db')
// http://localhost:5002/allUsers?email=abutaher01725@gmail.com
const usersModel = require('../app/model/Admin/usersListModel')
app.get('/user/allUser', usersModel.usersListAll)
app.get('/user/allUser/:id', usersModel.usersListSingle)
app.delete('/allUser/:id', usersModel.usersListDelete)
app.put('/updateUsers/:id', usersModel.UpdateSingleUser)
app.get('/allUsers', usersModel.getSingleUsersListEmail)
app.post('/login', usersModel.loginUserEmailPassword);




const adminPageList = require('../app/model/Admin/adminPageListModel')
app.get('/admin/allAdmin', adminPageList.getAllAdminPageList)
app.get('/admin/allAdmin/:id', adminPageList.getSingleAdminPageList)
app.delete('/admin/allAdmin/:id', adminPageList.deleteSingleAdminPageList)
app.post('/admin/allAdmin/', adminPageList.createAllAdminPageList)

const faIcons = require('../app/model/Admin/faIconsModel')
app.get('/faIcons', faIcons.getAllIconList)


  app.get('/', (req, res) => {
    res.send('Server running...')
  })


const port = process.env.PORT || 5002;
app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
})




