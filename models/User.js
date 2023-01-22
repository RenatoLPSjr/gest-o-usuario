var knex = require("../database/connection");
var bcrypt = require("bcrypt");


//Service
class User{


    async findAll(){
        try{
            var result = await knex.select(["id", "email", "nome", "role"]).table("users");
            return result;
        }catch(err){
            console.log(err);
            return [];
        }
       
    }

    async findById(id){
        try{
            var result = await knex.select(["id", "email", "nome", "role"]).where({id: id}).table("users");
            if(result.length > 0){
                return result[0];
            }else{
                return undefined;
            }

        }catch(err){
            console.log(err);
            return [];
        }
    }

    async new(email, password, nome){
        
        try{
            var hash = await bcrypt.hash(password, 10);
            await knex.insert({email, password: hash, nome, role: 0}).table("users");
        }catch(err){
            console.log(err);
        }
    }

    async findEmail(email) {

        try{
            var result = await knex.select("*").from("users").where({email: email});
            
            if(result.length > 0){
                return true;
            }else{
                return false;
            }


        }catch(err){
            console.log(err);
            return false;
        }
        
    }

    async update(id, email, nome, role){
        var user = await this.findById(id);

        if(user != undefined){
            
            var editUser = {}

            if(email != undefined){
                if(email != user.email){
                    var result = await this.findEmail(email);
                    if(result == false){
                        editUser.email = email
                    }else{
                        return{status: false, err: "O e-mail já está cadastrado"}
                    }
                }
            }

            if(nome != undefined){
                editUser.nome = nome;
            }

            if(role != undefined){
                editUser.role = role;
            }

            try{
                await knex.update(editUser).where({id: id}).table("users");
                return{status: true}
            }catch{
                return{status: false, err: err}
            }

           

        }else{
            return {status: false, err: "O usuario não existe!"}
        }
    }

    async delete(id){
        var user = await this.findById(id);
        if(user != undefined){

            try{
                await knex.delete().where({id: id}).table("users");
                return {status: true}
            }catch{
                return {status: false, err: err} 
            }

        }else{
            return {status: false, err: "O usuario não existe."}
        }
    }


}

module.exports= new User();