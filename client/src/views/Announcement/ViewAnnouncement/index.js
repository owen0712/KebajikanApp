import React, { useState, useEffect } from "react";
import "./view_announcement.css";
import Swal from "sweetalert2";
import { Loading } from "../../../components";
import Pagination from '@mui/material/Pagination';

const ViewAnnouncement = (props) => {
  const [announcements, setAnnouncements] = useState([]);
  const [displayedAnnouncements,setDisplayAnnouncements] = useState([]);
  const [page,setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const ROW_PER_PAGE = 3;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(()=>{
    setDisplayedAnnouncement();
  },[page,announcements])

  const fetchData = () => {
    setIsLoading(true);
    fetch("/announcement", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          Swal.fire({
            title: data.error,
            icon: "error",
            confirmButtonText: "Ok",
          });
        } else {
          setAnnouncements(data.announcements);
          setPage(1);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        Swal.fire({
          title: err,
          icon: "error",
          confirmButtonText: "Ok",
        });
      });
  };

  const handlePageOnChange = (event, value) => {
    setPage(value);
  }

  const setDisplayedAnnouncement = () =>{
    const firstRow = (page-1) * ROW_PER_PAGE + 1;
    const lastRow =  page * ROW_PER_PAGE;
    if(lastRow>=announcements.length){
        setDisplayAnnouncements(announcements.slice(firstRow-1));
    }
    setDisplayAnnouncements(announcements.slice(firstRow-1,lastRow));
  }

  return (
    <React.Fragment>
      {isLoading ? (
        <Loading/>
      ) : (
        <>
          <h1>ANNOUNCEMENT</h1>
          <div id="announcement-list">
            {displayedAnnouncements.map((announcement) => {
              return (
                <span key={announcement._id} className="announcement-card">
                  <h3>{announcement.title}</h3>
                  <img src={announcement.attachment.content} />
                  <span>
                    <p>{announcement.description}</p>
                    <small>{announcement.created_on.slice(0, 10)}</small>
                  </span>
                </span>
              );
            })}  
          </div>
          <div id="announcement-list-pagination">
              <Pagination count={announcements.length<=ROW_PER_PAGE?1:parseInt(announcements.length/ROW_PER_PAGE)+1} page={page} onChange={handlePageOnChange} />
          </div>
        </>
      )}
    </React.Fragment>
  );
};

export default ViewAnnouncement;
