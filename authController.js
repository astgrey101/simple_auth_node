const User = require('./models/User')
const Role = require('./models/Role')
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const { secret } = require('./config')

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles,
    }
    return jwt.sign(payload, secret, { expiresIn: '1h' })
}
class AuthController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'validation errors', errors })
            }
            const { username, password } = req.body
            const candidate = await User.findOne({username})
            if (candidate) {
                return res.status(400).json({ message: 'already exists' })
            }
            const userRole = await Role.findOne({ value: 'USER' })
            const hashPassword = bcrypt.hashSync(password, 7);
            const user = new User({ username, password: hashPassword, roles: [userRole.value] })
            await user.save()
            return res.json({ message: 'success' })
        } catch (e) {
            console.log(e)
            res.status(400).json({ message: 'error' })
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body
            const user = await User.findOne({username})
            if (!user) {
                return res.status(400).json({ message: 'not exists' })
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                res.status(400).json({ message: 'wrong password' })
            }
            const accessToken = generateAccessToken(user._id, user.roles)
            return res.json({ accessToken })
        } catch (e) {
            console.log(e)
            res.status(400).json({ message: 'error' })
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find()
            res.json(users)
        } catch (e) {
            console.log(e)
            res.status(400).json({ message: 'error' })
        }
    }
}

module.exports = new AuthController()







