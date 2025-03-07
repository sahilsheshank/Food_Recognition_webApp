
import axios from 'axios';

import { API_URL } from '../../constants/constant';
export const getRecipes= async(query)=>{
    try{
       let response=await axios.get(`${API_URL}/search?q=${query}`);
        return response.data;
    }
    catch(error)
    {
        console.log('error is found..',error.message);
        return error.response;
    }
}