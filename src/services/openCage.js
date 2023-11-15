// Consulta a api do google e retorna o endereço formatado com base na latitude e longitude
const getAddress = async (lat, lng) => {
    let address;    
    try {
        const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${process.env.OPENCAGE_API_KEY}`            
        );
        const data = await response.json();        
        address = data.results[0].components.town
    }
    catch (e) { 
        address = "not_found"
    }
    return address
}

module.exports = {
    getAddress,
}