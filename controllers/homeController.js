const renderHome = (request, response) => {
    return response.status(200).json({ message: 'Bem vindo a API do UrbanSOS' });
}

module.exports = {
    renderHome
}