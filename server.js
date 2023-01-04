const _ = require('lodash')
const express = require('express')
const cookieParser = require('cookie-parser')

const bugService = require('./services/bug.service.js')
const userService = require('./services/user.service.js')

const app = express()

// App configuration
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// List
app.get('/api/bug/', (req, res) => {
    console.log(req.query)
    const { title, labels, minSeverity, pageIdx, pageSize, sortByCat, desc } = req.query
    const sortBy = {
        sortByCat, desc
    }

    console.log('REQ FROM FRONT', sortBy)
    const filterBy = {
        title, labels, minSeverity, pageIdx, pageSize
    }
    bugService.query(filterBy, sortBy).then((bugData) => {
        console.log('bugData SERVER', bugData)
        const { bugs, totalPages } = bugData
        res.send({ bugs, totalPages })
    })
})

// Read - GetById
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    bugService.get(bugId)
        .then((bug) => {
            res.send(bug)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot get cars')
        })
})

// Update
app.put('/api/bug/:bugId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot update car')

    const bug = req.body
    bugService.save(bug, loggedinUser)
        .then((savedBug) => {
            res.send(savedBug)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot get cars')
        })
})

// Create
app.post('/api/bug/', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add car')

    const bug = req.body
    bugService.save(bug, loggedinUser)
        .then((savedBug) => {
            res.send(savedBug)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot create car')
        })
})

app.delete('/api/bug/:bugId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot update car')

    const { bugId } = req.params
    bugService.remove(bugId, loggedinUser)
        .then(() => {
            res.send({ msg: 'Bug removed successfully', bugId })
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot delete car')
        })
})


// User API:
// List
app.get('/api/user', (req, res) => {
    const filterBy = req.query
    userService.query(filterBy)
        .then((users) => {
            res.send(users)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot get users')
        })
})

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params
    userService.get(userId)
        .then((user) => {
            res.send(user)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot get user')
        })
})


app.post('/api/user/login', (req, res) => {
    const { username, password } = req.body
    userService.login({ username, password })
        .then((user) => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot login')
        })
})

app.post('/api/user/signup', (req, res) => {
    const { fullname, username, password } = req.body
    userService.signup({ fullname, username, password })
        .then((user) => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot signup')
        })
})

app.post('/api/user/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('Logged out')
})

app.listen(3030, () => console.log('Server ready at port 3030!'))

