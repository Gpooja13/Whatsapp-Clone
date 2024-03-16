import { GET_ALL_CONTACTS } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect,useState } from "react";

function ContactsList() {
const [first, setfirst] = useState(second)
  useEffect(()=>{
const getContacts=async()=>{
  const {}= await axios.get(GET_ALL_CONTACTS);
}
  },[])
  return <div>ContactsList</div>;
}

export default ContactsList;
