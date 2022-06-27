const router = require("express").Router();
const User = require("./../models/User.model")

const bcryptjs = require("bcryptjs");
const saltRounds = 10

const { isLoggedOut } = require("../middleware/session-guard");


router.get("/registro", isLoggedOut, (req, res) => {
    res.render("auth/signup")
})

router.post("/registro", isLoggedOut, (req, res) => {

    const { username, email, password: plainPassword } = req.body

    console.log("Esto NUNCA debe ir a la BBDD", plainPassword)

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(plainPassword, salt))
        .then(hashedPwd => User.create({ username, email, password: hashedPwd }))
        .then(() => res.redirect("/"))
        .catch(err => console.log(err))
})


router.get('/inicio-sesion', isLoggedOut, (req, res) => {
    res.render('auth/login')
})


router.post('/inicio-sesion', isLoggedOut, (req, res) => {

    const { email, password: plainPassword } = req.body

    if (email.length === 0 || plainPassword.length === 0) {
        res.render('auth/login', { errorMessage: 'Los campos son obligatorios' })
        return
    }

    User
        .findOne({ email })
        .then(user => {

            if (!user) {
                res.render('auth/login', { errorMessage: 'Usuario no reconocido' })
                return
            }

            if (bcryptjs.compareSync(plainPassword, user.password) === false) {
                res.render('auth/login', { errorMessage: 'Contraseña no válida' })
                return
            }

            req.session.currentUser = user          // Inicio de sesión
            res.redirect('/mi-perfil')
        })
        .catch(err => console.log(err))
})



router.post('/cerrar-sesion', (req, res) => {
    req.session.destroy()
    res.redirect('/inicio-sesion')
})


module.exports = router