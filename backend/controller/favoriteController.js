const { Request, Response } = require('express');
const favoriteRepository = require('../repository/favoriteRepository');
const { request, response } = require('../app');



const padrao = (request, response) => {    
    const users = favoriteRepository.findAll()
    console.log(users)
    return response.status(200).json(users)
}

const criar = (request, response) => {
    const usuarios = favoriteRepository.listarTodos();

    const entrada = request.body;
    if(usuarios.length===5){
        return response.status(400).json(
            {
                "error": `O limite de usuários foi ultrapassado. Não foi possível inserir o usuário: ${entrada.username}`
            }
        )
    }

    let estaNaLista = false 

    if(usuarios.length!=0){
        usuarios.forEach(user => {
            if(user.login===entrada.name){
                estaNaLista = true;

                return response.status(400).json({
                    "error": `Usuáriio ja está na lista. Não foi possivel inserir o usuario: ${entrada.login}`  
                }


                )
            }}
        )
    }

    if( estaNaLista === false){
        inserirUsuario(entrada.login);

        return response.status(201).json(
            {
                msg: "Usuario inserido!"
            }
        )
    }



}






































































const axios = require('axios');
const usuariosFavoritos = [];

const inserirUsuario = async (req, res) =>{
    const usuario = req.param;
    if(usuariosFavoritos.some((perfil) => perfil.login === user.login )) {
        res.json({
            msg: "Usuario ja esta na lista"
        })
    }else{
        try{
            const resposta = await axios.get(`https://api.github.com/users${usuario}`);
            const login = resposta.data.login;
            const nome = resposta.data.name;
            const avatar = resposta.data.avatar_url;
            const perfilUrl = resposta.data.url;
            const user = { login : login, name : nome, avatar_url : avatar, url: perfilUrl };
            memoria.usuarios.push(user);
            console.log(user);
        } catch(err){
            res.json({msg : "Usuario não encontrado"+err});
        }

        
}

}

 


module.exports = {
    inserirUsuario

}