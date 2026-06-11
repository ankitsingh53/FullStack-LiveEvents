import express from "express";
import { pool } from "../connectDB/db.js";

export const fetchById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = await pool.query("SELECT * FROM events WHERE id=$1", [id]);
    if (!data) {
      return res.status(404).json({
        message: "No event is available. Please create the Event",
      });
    }
    return res.status(200).json(data.rows);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      message: "Some error has occured",
    });
  }
};
