import cors from 'cors'
import express from 'express'
import https from 'https'
import dotenv from 'dotenv'
dotenv.config()
import axios from 'axios'
const app=express();
const API_URL = 'https://api.render.com/v1/services?includePreviews=true&limit=20';
app.use(cors())
console.log("Bearer Token:", process.env.API_TOKEN);
const agent = new https.Agent({  
    rejectUnauthorized: false
});
    app.get('/', async (req, res) => {
        try {
            const response = await axios.get(API_URL, {
                headers: {
                    'accept': 'application/json',
                    'authorization': `Bearer ${process.env.API_TOKEN}`
                   },   httpsAgent: agent
            });
            res.json(response.data);
        } catch (error) {
            res.status(error.response?.status || 500).json({
                error: 'Failed to fetch services',
                details: error.response?.data || error.message
            });
        }

})

app.listen("8080",()=>{console.log("run barouch hashem")})




