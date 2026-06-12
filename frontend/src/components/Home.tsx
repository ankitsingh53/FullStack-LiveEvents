import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./NavBar";
import Product from "./Product";
import { useState, useEffect } from "react";
import { createContext } from "react";
import CreateEvent from "./CreateEvent";
import Update from "./Update";
import ProductDetails from "./ProductDetails";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
interface Event {
  id: string;
  title: string;
  summary: string;
  date: string;
  start_time: string;
  end_time: string;
}
interface ContextData {
  eventData: Event[] | null;
  setEventData: React.Dispatch<React.SetStateAction<Event[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  err: string | "";
  fetchEvent: () => void;
  search: string | "";
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  filterData: Event[];
  setErr: React.Dispatch<React.SetStateAction<string>>;
  currentpage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  baseUrl: string;
}
export const NameContext = createContext<ContextData | null>(null);
const Home = () => {
  const [eventData, setEventData] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string>("");
  const [currentpage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const baseUrl = import.meta.env.VITE_API_URL
  const fetchEvent = async (): Promise<void> => {
    try {
      const result = await fetch(
        `${baseUrl}/api/getevents`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!result.ok) {
        throw new Error("Network response failed...");
      }
      const data = await result.json();
      setEventData(data);
      return data
    } catch (error) {
      if (error instanceof Error) {
        setErr(error.message);
      } else {
        setErr("Something is Wrong");
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if(!search.trim()){
      fetchEvent();
      return;
    }
    const timer = setTimeout( async () => {
      const data = await fetch(`${baseUrl}/api/search?word=${search}`)
      const result = await data.json();
      setEventData(result)
      setCurrentPage(1);
    }, 800);
    return () => clearTimeout(timer);
  }, [search]);
  useEffect(() => {
   fetchEvent();
  }, []);
  const filterData: Event[] = eventData;   
  return (
    <>
      <NameContext.Provider
        value={{
          eventData,
          setEventData,
          loading,
          setLoading,
          err,
          fetchEvent,
          search,
          setSearch,
          filterData,
          setErr,
          currentpage,
          setCurrentPage, 
          baseUrl
        }}
      >
        <ToastContainer />
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<Product />} />
            <Route path="/create" element={<CreateEvent />} />
            <Route path="/update/:id" element={<Update />} />
            <Route path="/productdetails/:id" element={<ProductDetails />} />
          </Routes>
        </BrowserRouter>
      </NameContext.Provider>
    </>
  );
};

export default Home;
