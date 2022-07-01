const UserModel = require('../database/user');
const bcrypt = require("bcrypt");


class UserController {

    async create(req, res) {
        const user = new UserModel(req.body);
        if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }
        await user
            .save()
            .then(response => {
                return res.status(200).json("Usuário criado")
            }).catch((err) => {
                return res.status(500).json("Houve um erro ao criar o usuário: " + err)
            });
    }

    async all(req, res) {
        await UserModel.findAll({})
            .then(response => {
                return res.status(200).json(response);
            })
            .catch(error => {
                return res.status(500).json(error);
            });
    }

    async delete(req, res) {
        await UserModel.destroy({ where: { id: req.params.id } })
            .then(response => {
                return res.status(200).json("Usuário deletado")
            })
            .catch(error => {
                return res.status(500).json(error);
            })
    }
}


module.exports = new UserController();