const UserModel = require('../database/user');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require('dotenv').config();

class SignUpController {

    async signup(req, res) {
        const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ error: `Faltando o campo ${field}` });
            }
        }
        let user = await UserModel.findOne({ where: { email: req.body.email } });
        if (user) {
            return res.status(400).json({ error: "Já existe um usuário cadastrado com esse email" });
        }
        const { password, passwordConfirmation } = req.body
        if (password !== passwordConfirmation) {
            return res.status(400).json({ error: "Os campos senha e confirmação de senha são diferentes" })
        }
        user = new UserModel(req.body);
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user
            .save()
            .then(response => {
                const token = jwt.sign({ userId: user.id }, process.env.NODE_SECRET, { expiresIn: 300 })
                return res.status(200).json({ token, user })
            }).catch((err) => {
                return res.status(500).json("Houve um erro ao criar o usuário: " + err)
            });
    }
}


module.exports = new SignUpController();