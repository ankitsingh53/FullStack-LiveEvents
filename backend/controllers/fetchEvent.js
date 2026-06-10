import express from 'express'
import {pool} from '../connectDB/db.js'

export const fetchEvent = async (req, res)=>{
    try {
        const data = await pool.query('SELECT * FROM events')
        // console.log(data.rows)
        if(!data){
            return res.status(404).json({
                success: false,
                message: 'No event is available. Please create the Event'
            })
        }
        return res.status(200).json(data.rows);
    } catch (error) {
        return res.status(500).json({
            error: error.message,
            message: "Some error has occured"
        })
    }
}