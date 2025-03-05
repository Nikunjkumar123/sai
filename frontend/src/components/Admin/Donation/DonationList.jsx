import React, { useEffect, useState } from "react";
import "../Sidebar/Sidebar.css";
import axios from "axios";
import Swal from "sweetalert2";

const DonationList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [list, setList] = useState(null);
  const [UserId, setUserId] = useState(sessionStorage.getItem("UserId") || "");
  const usersPerPage = 15;

  const getUserdata = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/all-donatation`);
      if (res.status === 200) {
        console.log("API Response:", res.data); // Print the entire API response
        // Assuming the data is within a 'data' property
        setList(res.data || []);
        console.log("Users Data State Updated:", res.data);
      }
    } catch (error) {
      console.error("Error fetching donation data:", error);
      Swal.fire("Error", "Failed to fetch donation data.", "error");
    }
  };

  useEffect(() => {
    getUserdata();
  }, []);

  useEffect(() => {
    if (list) {
      console.log("My Donations Data:", list.myDonation);
      console.log("My Childs Donations Data:", list.myChildsDonation);
    }
  }, [list]);

  const filteredMyDonations = list?.myDonation?.filter(
    (user) =>
      user.userId.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userId.logId.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredMyChildsDonations = list?.myChildsDonation?.filter(
    (user) =>
      user.userId.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userId.logId.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentMyDonations = filteredMyDonations.slice(indexOfFirstUser, indexOfLastUser);
  const totalMyDonationPages = Math.ceil(filteredMyDonations.length / usersPerPage);

  const currentMyChildsDonations = filteredMyChildsDonations.slice(indexOfFirstUser, indexOfLastUser);
  const totalMyChildsDonationPages = Math.ceil(filteredMyChildsDonations.length / usersPerPage);

  return (
    <div className="container table-container mt-4 mb-5">
      {list?.myDonation && (
        <div className="donation-search">
          <div className="row">
            <div className="col-9">
              <h3 className="mb-2">My Donation List</h3>
              <p className="mb-3">List of all Paid and Unpaid retail orders</p>
            </div>
          </div>
        </div>
      )}

      {list?.myDonation && (
        <div className="table-responsive">
          <table className="table table-striped text-center">
            <thead>
              <tr>
                <th scope="col">Sr No</th>
                <th scope="col">Name</th>
                <th scope="col">Log Id</th>
                <th scope="col">Amount</th>
                <th scope="col">Date / Time</th>
              </tr>
            </thead>
            <tbody>
              {currentMyDonations.length > 0 ? (
                currentMyDonations.map((user, index) => (
                  <tr key={index}>
                    <th scope="row">{indexOfFirstUser + index + 1}</th>
                    <td>{user.userId.firstName}</td>
                    <td>{user.userId.logId}</td>
                    <td>{user.amount}</td>
                    <td>{new Date(user.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {list?.myChildsDonation && (
        <div className="donation-search">
          <div className="row">
            <div className="col-9">
              <h3 className="mb-2">Team Donation List</h3>
              <p className="mb-3">List of all Paid and Unpaid retail orders</p>
            </div>
          </div>
        </div>
      )}

      {list?.myChildsDonation && (
        <div className="table-responsive">
          <table className="table table-striped text-center">
            <thead>
              <tr>
                <th scope="col">Sr No</th>
                <th scope="col">Name</th>
                <th scope="col">Log Id</th>
                <th scope="col">Amount</th>
                <th scope="col">Date / Time</th>
              </tr>
            </thead>
            <tbody>
              {currentMyChildsDonations.length > 0 ? (
                currentMyChildsDonations.map((user, index) => (
                  <tr key={index}>
                    <th scope="row">{indexOfFirstUser + index + 1}</th>
                    <td>{user.userId.firstName}</td>
                    <td>{user.userId.logId}</td>
                    <td>{user.amount}</td>
                    <td>{new Date(user.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="d-flex justify-content-center align-items-center">
        <button
          className="btn btn-next me-2"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalMyDonationPages}
        </span>
        <button
          className="btn btn-next ms-2"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalMyDonationPages))
          }
          disabled={currentPage === totalMyDonationPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DonationList;
