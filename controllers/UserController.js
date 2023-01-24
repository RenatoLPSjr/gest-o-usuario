var User = require("../models/User");
var PasswordToken = require("../models/PasswordToken")

class UserController {
    async index(req, res){
       var users = await User.findAll();
       res.json(users);
    }

    async findUser(req, res){
        var id = req.params.id;
        var user = await User.findById(id);
        if(user == undefined){
            res.status(404);
            res.json({err: "Id não encontado"});
        }else{
                res.json(user);
        }
    }

    async create(req, res) {
        var {email, nome, password} = req.body;

        if(email == undefined){
            res.status = 400;
            res.json({err: "O email é invalido!"});
            return;
        }

        var emailExists = await User.findEmail(email);

        if(emailExists){
            res.status(406);
            res.json({err: "O email já está cadastrado!"});
            return
        }

        await User.new(email, password, nome);


        res.status = 200;
        res.send("Pegando o corpo da requisição!");
    }

    async edit(req, res){
        var{id, nome, role, email} = req.body;
        var result = await User.update(id, email, nome, role);
        if(result != undefined){
            if(result.status){
                res.status(200);
                res.send("Tudo ok");
            }else{
                res.status(406);
                res.json(result.err);
            }
        }else{
            res.status(406);
            res.json("Ocorreu um erro no servidor");
        }
    }

    async remove(req, res){
        var id = req.params.id;

        var result = await User.delete(id);

        if(result.status){
            res.status(200);
            res.send("Tudo ok!");
        }else{
            res.status(406);
            res.send(result.err);
        }
    }

    async recoverPassword(req, res){
        var email = req.body.email;
        var result = await PasswordToken.create(email);
        if(result.status){
            console.log("" + result.token)
        }else{
            res.status(406);
            res.send(result.err);
        }
    }

    async changePassword(req, res){
        var token = req.body.token;
        var password = req.body.password;

        var isTokenValid = await PasswordToken.validate(token);

        if(isTokenValid.status){

           await User.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token);
            res.status(200);
            res.send("Senha alterada");
        }else{ 
            res.status(406);
            res.send("Token Invalido!");
        }
    }

    
}


module.exports =  new UserController();