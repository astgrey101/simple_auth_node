const Router = require('express')
const router = new Router()
const authController = require('./authController')
const { check } = require('express-validator')
const authMiddleware = require('./middleware/authMiddleware')
const roleMiddleware = require('./middleware/rolesMiddleware')

router.post('/registration', [
    check('username', 'имя не может быть пустым').notEmpty(),
    check('password', 'пароль должен быть более 4 символов')
        .isLength({ min: 4, max: 10 }),
], authController.registration)
router.post('/login', authController.login)
router.get('/users', roleMiddleware(['ADMIN']), authController.getUsers)




module.exports = router
