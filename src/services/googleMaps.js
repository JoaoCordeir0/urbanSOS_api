// Consulta a api do google e retorna o endereço formatado com base na latitude e longitude
const getAddress = async (lat, lng) => {
    let address;
    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&location_type=ROOFTOP&result_type=street_address&key=${process.env.GOOGLE_API_KEY}`
        );
        const data = await response.json();
        address = data.results[0].formatted_address        
    }
    catch (e) { 
        address = "not_found"
    }
    return address
}

module.exports = {
    getAddress,
}