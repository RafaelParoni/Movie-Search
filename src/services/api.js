import axios from 'axios';


//  12237837/json/
const api = axios.create({
    baseURL: 'https://www.omdbapi.com/?s='
})

export default api;