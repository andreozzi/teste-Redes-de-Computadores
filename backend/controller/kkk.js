const { Request, Response } = require('express')
const favoriteRepository = require('../repository/favoriteUser')
const { request, response } = require('../app')


const index = (request, response) => {
    const users = favoriteRepository.findAll()

    console.log(users)

    return response.status(200).json(users)
}

const create = (request, response) => {
    const { users } = favoriteRepository.findAll()

    const data = request.body

    if (users.length == 5) {
        return response.status(400).json(
            {
                "error": `O limite de usuários é cinco. Não foi possível inserir o usuário: ${data.username}`
            }
        )
    }

    let alreadyExists = false

    if (users.length != 0) {

        users.forEach(element => {
            if (element.id === data.id) {

                alreadyExists = true

                return response.status(400).json(
                    {
                        "error": `O usuário: ${data.username} já existe. Não é possível inserir`
                    }
                )
            }
        });
    }

    if (alreadyExists == false) {
        favoriteRepository.insertOne(data)

        return response.status(201).json("created")
    }
}

const deleteOne = (request, response) => {
    const username = request.params.username

    const { users } = favoriteRepository.findAll()

    users.forEach((user, index) => {
        if (user.username == username) {
            favoriteRepository.deleteOne(index)

            return response.status(200).json(
                {
                    "msg": `Usuário ${username} deletado com sucesso`
                }
            )
        }
    })

    return response.status(400).json(
        {
            "error": `Usuário: ${username} não encontrado`
        }
    )
}

const toogleFavorite = (request, response) => {
    const username = request.params.username

    if (favoriteRepository.makeFavorite(username)) {
        return response.status(200).json(
            { "msg": `O usuário ${username} agora é o favorito` }
        )
    } else {
        return response.status(200).json(
            { "msg": `O usuário ${username} não é mais o favorito` }
        )
    }
}

module.exports = {
    index,
    create,
    deleteOne,
    toogleFavorite
}














const db = {
    "favorite_user": "",
    "users": []
}



const findAll = () => {
    return db
}

const insertOne = (data) => {
    db.users.push(data)
}

const deleteOne = (index) => {
    db.users.splice(index, 1)
}

const makeFavorite = (user) => {
    if (db.favorite_user == user) {
        db.favorite_user = ""
        return false
    } else {
        db.favorite_user = user
        return true
    }

}


module.exports = {
    findAll,
    insertOne,
    deleteOne,
    makeFavorite
}