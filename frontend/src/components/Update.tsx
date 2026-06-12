import { Box, Typography, Stack, TextField, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { NameContext } from "./Home";
import { useParams } from "react-router-dom";
import z from "zod";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./Loader";
interface FormType {
  title: string;
  summary: string;
  date: string;
  start_time: string;
  end_time: string;
}
interface Errors {
  title?: string;
  summary?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
}
const schema = z
  .object({
    name: z.string().min(1, "Title is required"),
    summary: z.string().min(10, "min 10 characters"),
    date: z.string().min(1, "Date is required"),
    start_time: z.string().min(1, "Start time is required"),
    end_time: z.string().min(1, "End time is required"),
  })
  .refine((obj) => obj.start_time < obj.end_time, {
    message: "End time must be after start time",
    path: ["end_time"],
  });
const Update = () => {
  const navigate = useNavigate();
  const [err, setErr] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [useLibrary, setUseLibrary] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormType>({
    title: "",
    summary: "",
    date: "",
    start_time: "",
    end_time: "",
  });
  const { id }= useParams();
  const context = useContext(NameContext);
  if (!context) {
    return;
  }
  const { fetchEvent, filterData , eventData, baseUrl} = context;
  const bookedDate = eventData?.map((event)=>event.date.split('T')[0])
  useEffect(() => {
    if(filterData.length ===0){
      fetchEvent();
      return
    };
    const currentData = filterData.find(
    (item) => {
      return String(item.id) === id;
    },
  );
    if (!currentData) return;
    const changedate = currentData.date;
    const newFormData = {
      title: currentData.title|| "",
      summary: currentData.summary || "",
      date: changedate.split("T")[0] || "",
      start_time: currentData.start_time.slice(0,5) || "",
      end_time: currentData.end_time.slice(0,5) || "",
    };
    setFormData(newFormData);
  }, [filterData, id]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.name ==='date' && bookedDate?.includes(e.target.value)){
      toast.error("This date is already booked!");
      return;
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };
  const customValidate = () => {
    const newErrors: Errors = {};
    let isValid: boolean = true;
    if (!formData.title) {
      newErrors.title = "Event name is required";
      isValid = false;
    }
    if (!formData.summary) {
      newErrors.summary = "Summary is required";
      isValid = false;
    }
    if (!formData.date) {
      newErrors.date = "Date is required";
      isValid = false;
    }
    if (!formData.start_time) {
      newErrors.start_time = "Start time is required";
      isValid = false;
    }
    if (!formData.end_time) {
      newErrors.end_time = "End time is required";
      isValid = false;
    } else if (formData.end_time <= formData.start_time) {
      newErrors.end_time = "End time must be after start time";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };
  const zodValidate = () => {
    const result = schema.safeParse(formData);
    if (result.success === false) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((e) => {
        newErrors[e.path[0] as string] = e.message;
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    const isValid: boolean = useLibrary ? zodValidate() : customValidate();
    if (!isValid) return;
    setLoading(true)
    try {
      const result = await fetch(`${baseUrl}/api/updateevents/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)  
      });
      if (result.ok) {
        fetchEvent();
        toast.success("Event Updated Successfully", {
          autoClose: 2000,
        });
        navigate("/");
        setFormData({
          title: "",
          summary: "",
          date: "",
          start_time: "",
          end_time: "",
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        setErr(error.message);
      } else {
        setErr("Something went wrong");
      }
    } finally{
      setLoading(false)
    }
  };
  if (err) {
    return <h1>Server Error: ${err}</h1>;
  }
  return (
    <>
    {loading&& <Loader/>}
      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{ margin: "1% 25%", width: "40%", padding: "20px" }}
        onSubmit={handleSubmit}
      >
        <Typography variant="h3" gutterBottom>
          Update an event
        </Typography>
        <button
          type="button"
          onClick={() => {
            setUseLibrary(!useLibrary);
            setErrors({});
          }}
        >
          Switch to {useLibrary ? "Custom" : "Zod"} Validation
        </button>
        <p>Current: {useLibrary ? "Zod" : "Custom"}</p>
        <Stack spacing={2} sx={{ margin: "10px" }}>
          <Typography variant="body1" gutterBottom>
            Update the name of your event?
          </Typography>
          <TextField
            id="outlined-basic"
            label="Event title"
            variant="outlined"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && <p style={{ color: "red" }}>{errors.title}</p>}
          <Typography variant="body1" gutterBottom>
            Update summary of an event
          </Typography>
          <TextField
            id="outlined-basic"
            label="Summary"
            variant="outlined"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
          />
          {errors.summary && <p style={{ color: "red" }}>{errors.summary}</p>}
          <Typography variant="body1" gutterBottom>
            Update your event start?
          </Typography>
          <TextField
            id="outlined-basic"
            variant="outlined"
            name="date"
            type="date"
            slotProps={{
              htmlInput: {
                min: new Date().toISOString().split("T")[0],
              },
            }}
            value={formData.date}
            onChange={handleChange}
          />
          {errors.date && <p style={{ color: "red" }}>{errors.date}</p>}
          <Typography variant="body1" gutterBottom>
            Update Start Time:
          </Typography>
          <TextField
            id="outlined-basic"
            variant="outlined"
            name="start_time"
            type="time"
            value={formData.start_time}
            onChange={handleChange}
          />
          {errors.start_time && (
            <p style={{ color: "red" }}>{errors.start_time}</p>
          )}
          <Typography variant="body1" gutterBottom>
            Update End Time:
          </Typography>

          <TextField
            id="outlined-basic"
            variant="outlined"
            name="end_time"
            type="time"
            value={formData.end_time}
            onChange={handleChange}
          />
          {errors.end_time && <p style={{ color: "red" }}>{errors.end_time}</p>}
          <Button
            variant="contained"
            size="large"
            color="primary"
            type="submit"
          >
            Update
          </Button>
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={() => navigate("/")}
          >
            Go Back
          </Button>
        </Stack>
      </Box>
    </>
  );
};

export default Update;
