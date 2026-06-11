import Box from "@mui/material/Box";
import { useContext, useState } from "react";
import { NameContext } from "./Home";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./Loader";
import "../App.css";
interface ItemData {
  id: number | string;
  title: string;
  summary: string;
  date: string;
  start_time: string;
  end_time: string;
}
const Product = () => {
  const context = useContext(NameContext);
  const [currentpage, setCurrentPage] = useState(1);
  const [loader, setLoader] = useState(false);
  const [popUp, setpopUp] = useState<boolean>(false);
  const [deleteId, setDeleteID] = useState<number | null>();
  if (!context) return;
  const { filterData, loading, err, fetchEvent, setErr } = context;
  const itemsPerPage = 8;
  const starIndex = (currentpage - 1) * itemsPerPage;
  const endIndex = starIndex + itemsPerPage;
  const currentItems = filterData.slice(starIndex, endIndex);
  const totalPages = Math.ceil(filterData.length / itemsPerPage);
  const goToSpecificPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  const handleDelete = async (id: number) => {
    setLoader(true)
    setTimeout( async ()=>{
      try {
      const result = await fetch(`/api/deleteevents/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (result.ok) {
         fetchEvent();
        toast.success("Event Deleted Successfully", {
          autoClose: 2000,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        setErr(error.message);
      }
    } finally {
      setLoader(false)
    }
    }, 1000)
  };
  const formatTime = (time:String)=>{
    const [hours, minutes] = time.split(':')
    const period = Number(hours)>=12 ? 'PM':'AM';
    const hour = Number(hours)%12 || 12;
    return `${hour}:${String(minutes).padStart(2, '0')} ${period}`
  }

  if (loading) {
    return <Loader />;
  }
  if (err) {
    return <h3>Error: {err}</h3>;
  }
  return (
    <>
    {loader && <Loader/>}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          margin: "70px",
          gap: "50px",
        }}
      >
        {currentItems.length !== 0 ? (
          currentItems.map((item: ItemData) => (
            <Box
              key={item.id}
              sx={{
                padding: "20px",
                boxShadow: "0 0 10px 0",
                width: "320px",
                minHeight: "400px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                overflowWrap: "break-word",
              }}
            >
              <Box>
                <h2>{item.title}</h2>
                <p>{item.summary}</p>
              </Box>
              <Box>
                <p>
                  <span style={{ fontWeight: "bolder" }}>Start time:-</span>{" "}
                  {formatTime(item.start_time)}
                </p>
                <p>
                  <span style={{ fontWeight: "bolder" }}>End time:-</span>{" "}
                  {formatTime(item.end_time)}
                </p>
              </Box>
              <Stack spacing={1}>
                <Button
                  sx={{ backgroundColor: "rgb(14, 114, 28)", color: "white" }}
                >
                  <Link
                    to={`/productdetails/${item.id}`}
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    View Details
                  </Link>
                </Button>
                <Button
                  sx={{ backgroundColor: "rgb(20, 81, 112)", color: "white" }}
                >
                  <Link
                    to={`/update/${item.id}`}
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    Update Event
                  </Link>
                </Button>
                <Button
                  sx={{ backgroundColor: "rgb(161, 9, 9)", color: "white" }}
                  onClick={() => {
                    setDeleteID(Number(item.id));
                    setpopUp(true);
                  }}
                >
                  Delete
                </Button>
              </Stack>
            </Box>
          ))
        ) : (
          <h2>Results not found</h2>
        )}
        {popUp && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 999,
            }}
          >
            <Box
              sx={{
                background: "white",
                padding: "30px",
                borderRadius: "10px",
                textAlign: "center",
              }}
            >
              <h3>Are you sure you want to delete?</h3>
              <Stack direction="row" spacing={1} sx={{ marginTop: "10px" }}>
                <Button variant="contained" onClick={() => setpopUp(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    handleDelete(Number(deleteId));
                    setpopUp(false);
                  }}
                  sx={{ backgroundColor: "rgb(161, 9, 9)", color: "white" }}
                >
                  Yes
                </Button>
              </Stack>
            </Box>
          </Box>
        )}
      </Box>
      {currentItems.length !== 0 && (
        <div
          style={{
            margin: "20px auto",
            padding: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <button
            style={{
              padding: "10px",
              fontSize: "1rem",
              borderRadius: "10px",
            }}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentpage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => goToSpecificPage(i + 1)}
              className={currentpage === i + 1 ? "active" : ""}
              style={{
                padding: "10px",
                fontSize: "1rem",
                border: "none",
                outline: "none",
                borderRadius: "10px",
              }}
            >
              {i + 1}
            </button>
          ))}
          <button
            style={{
              padding: "10px",
              fontSize: "1rem",
              borderRadius: "10px",
            }}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentpage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default Product;
