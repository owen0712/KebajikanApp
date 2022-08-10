import React, { useState, useEffect } from "react";
import "./view_announcement.css";
import Swal from "sweetalert2";
import { Loading } from "../../../components";

const ViewAnnouncement = (props) => {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

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

  return (
    <React.Fragment>
      {isLoading ? (
        <Loading/>
      ) : (
        <>
          <h1>ANNOUNCEMENT</h1>
          <div id="event-list">
            {announcements.map((announcement) => {
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
        </>
      )}
    </React.Fragment>
  );
};

export default ViewAnnouncement;
