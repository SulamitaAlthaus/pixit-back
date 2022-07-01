const UserModel = require('../database/user');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require('dotenv').config();

class LoginController {

    async login(req, res) {
        const user = await UserModel.findOne({ where: { email: req.body.email } })
        if (user) {
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) {
                return res.status(400).json({ error: "Senha incorreta" });
            } else {
                const token = jwt.sign({ userId: user.id }, process.env.NODE_SECRET, { expiresIn: 300 })
                res.status(200).json({ user, token })
            }
        } else {
            res.status(400).json({ error: "Usuário não existe" });
        }
    }
}


module.exports = new LoginController();