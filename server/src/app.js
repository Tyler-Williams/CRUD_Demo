const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const Post = require('../models/post')
const app = express()

app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

//  DATABASE
mongoose.connect('mongodb://localhost:27017/posts')
let db = mongoose.connection
db.on('error', console.error.bind(console, 'Connection Error'))
db.once('open', (callback) => {
  console.log('connection succeeded')
})

//  ROUTES

//  GET REQ
app.get('/posts', (req, res) => {
  Post.find({}, 'title description', (error, posts) => {
    if (error) {console.error(error)}
    res.send({
      posts: posts
    })
  }).sort({_id: -1})
})

//  POST REQ
app.post('/posts', (req, res) => {
  const title = req.body.title
  const description = req.body.description

  const newPost = new Post({
    title: title,
    description: description
  })

  newPost.save((error) => {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true,
      message: 'Post saved sccessfully'
    })
  })
})

app.listen(process.env.PORT || 8081)
