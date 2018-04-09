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

//  GET single item REQ
app.get('/posts/:id', (req, res) => {
  Post.findById(req.params.id, 'title description', (err, post) => {
    if (err) { console.error(err) }
    res.send(post)
  })
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

//  PUT REQ
app.put('/posts/:id', (req, res) => {
  Post.findById(req.params.id, 'title description', (err, post) => {
    if (err) { console.error(err) }

    post.title = req.body.title,
    post.description = req.body.description

    post.save((err) => {
      if (err) { console.error(err) }
      res.send({
        success: true
      })
    })
  })
})

//  DELETE REQ
app.delete('/posts/:id', (req, res) => {
  Post.remove({
    _id: req.params.id
  }, (err, post) => {
    if (err) { res.send(err) }
    res.send({
      success: true
    })
  })
})

app.listen(process.env.PORT || 8081)
