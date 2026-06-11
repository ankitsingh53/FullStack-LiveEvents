import express from 'express'
import { pool } from '../connectDB/db.js'

export const searchWord = async(req, res)=>{
    
    try {
        const { word } = req.query;
        const trimWord = word?.trim();
        if(!trimWord){
            return res.status(400).json({
                message: "Search word is required"
            });
        }
        const response = await pool.query(`SELECT * FROM events WHERE title iLIKE $1`, [`%${trimWord}%`]);
        return res.status(200).json(response.rows)
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}