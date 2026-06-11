import express from 'express'
import { pool } from '../connectDB/db.js'

export const deleteEvent = async (req, res)=>{
    try {
        const id = Number(req.params.id);
        await pool.query('DELETE FROM events WHERE id=$1',[id])
        return res.status(200).json({
            status: 'ok',
            message: 'Event Deleted Successfully'
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}