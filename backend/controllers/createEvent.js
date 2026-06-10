import express from 'express';
import { pool } from '../connectDB/db.js';

export const createEvent = async(req, res)=>{
    
    try {
        const {title, summary, date, start_time, end_time} = req.body;
        if(!title.trim() && !summary.trim() && !date.trim() && !start_time.trim() && !end_time.trim()){
            return res.status(400).json({
                success: "404 Bad request",
                message: "All fields Required"
            })
        }
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

