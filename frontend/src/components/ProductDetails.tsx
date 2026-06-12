import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { NameContext } from "./Home";
import Button from "@mui/material/Button";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
interface CurrentEvent {
  id: string;
  title: string;
  summary: string;
  date: string;
  start_time: string;
  end_time: string;
}
const ProductDetails = () => {
  const context = useContext(NameContext);
  const { id } = useParams();
  const [result, setResult] = useState<CurrentEvent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string>("");
  const navigate = useNavigate();
  if (!context) return;
  const {baseUrl} = context;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/getevents/${id}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Network response failed...");
        }
        const data = await response.json();
        setResult(data[0]);
      } catch (error) {
        if (error instanceof Error) {
          setErr(error.message);
        } else {
          setErr("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);
  if(loading){
    return <Loader/>
  }
  if (err) {
    return <h3>Error: {err}</h3>;
  }
  if (!result) return;
  const eventDate = new Date(result?.date);
  const date = eventDate.toLocaleDateString();
  const formatTime = (time:String)=>{
    const [hours, minutes] = time.split(':')
    const period = Number(hours)>=12 ? 'PM':'AM';
    const hour = Number(hours)%12 || 12;
    return `${hour}:${String(minutes).padStart(2, '0')} ${period}`
  }
  return (
    <>
      <Box
        sx={{
          padding: "30px",
          boxShadow: "0 0 10px 0",
          width: "40%",
          minHeight: "250px",
          height: "auto",
          textAlign: "justify",
          margin: "60px",
        }}
      >
        <h2>{result?.title}</h2>
        <p>{result?.summary}</p>
        <p>Date:- {date}</p>
        <p>Start time:- {formatTime(result?.start_time)}</p>
        <p>End time:- {formatTime(result?.end_time)}</p>
        <Button
          variant="contained"
          size="large"
          color="primary"
          type="submit"
          onClick={() => navigate("/")}
          sx={{ display: "flex", alignItems: "flex-end" }}
        >
          Go To Home Page
        </Button>
      </Box>
    </>
  );
};
export default ProductDetails;
