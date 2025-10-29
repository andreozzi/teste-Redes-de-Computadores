 const usuariosFavoritos = [];


const listarTodos = () => {
    return usuariosFavoritos;
}
const inserirUsuario = (usuario) => {
    if(usuariosFavoritos.some((user)=>user.nome===usuario)){
        usuariosFavoritos.push(usuario);
    }
}


module.exports = {
    listarTodos
}