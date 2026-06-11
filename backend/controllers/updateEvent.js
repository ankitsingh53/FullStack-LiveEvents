import express from "express";
import { pool } from "../connectDB/db.js";

export const updateEvent = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, summary, date, start_time, end_time } = req.body;
    if (!title && !summary && !date && !start_time && !end_time) {
      return res.status(400).json({
        error: "404 Bad request",
        message: "All fields Required",
      });
    }
    if (!title.trim()) {
      return res.status(400).json({
        message: "Title is required",
      });
    }
    if (!summary.trim()) {
      return res.status(400).json({
        message: "Summary is required",
      });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date.trim())) {
      return res.status(400).json({
        message: "Date must be in YYYY-DD-format",
      });
    }
    if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(start_time.trim())) {
      return res.status(400).json({
        message: "Time must be in HH:MM format",
      });
    }
    if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(end_time.trim())) {
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
      "UPDATE events SET title =$1, summary = $2,  date = $3,  start_time = $4,  end_time = $5 WHERE id =$6 RETURNING *",
      [title, summary, date, start_time, end_time, id],
    );
    if (data.rowCount === 0) {
      return res.status(404).json({
        message: "Event not found",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Event updated successfully",
      data: data.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
