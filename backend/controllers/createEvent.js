import express from "express";
import { pool } from "../connectDB/db.js";

export const createEvent = async (req, res) => {
  try {
    const { title, summary, date, start_time, end_time } = req.body;
    if (
      !title.trim() &&
      !summary.trim() &&
      !date.trim() &&
      !start_time.trim() &&
      !end_time.trim()
    ) {
      return res.status(400).json({
        message: "All fields Required",
      });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        message: "Date must be in YYYY-DD-format",
      });
    }
    if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(start_time)) {
      return res.status(400).json({
        message: "Time must be in HH:MM format",
      });
    }
    if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(end_time)) {
      return res.status(400).json({
        message: "Time must be in HH:MM format",
      });
    }
    if (start_time >= end_time) {
      return res.status(400).json({
        message: "End time must be greater than start time",
      });
    }
    const data = await pool.query(
      "INSERT INTO events (title, summary, date, start_time, end_time) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, summary, date, start_time, end_time],
    );
    return res.status(201).json(data.rows[0]);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
