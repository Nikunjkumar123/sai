import React, { useState, useEffect } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from "axios";
import Swal from "sweetalert2";

const TotalDonation = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const [usersData, setUsersData] = useState([]);
    const usersPerPage = 10;

    const getUserdata = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/all-donatation`);
            if (res.status === 200) {
                console.log("Donation Data:", res.data);
                // Assuming the data is within a 'data' property
                setUsersData(res.data.data || []);
                console.log("Users Data State Updated:", res.data.data);
            }
        } catch (error) {
            console.error("Error fetching donation data:", error);
            Swal.fire("Error", "Failed to fetch donation data.", "error");
        }
    };

    useEffect(() => {
        getUserdata();
    }, []);

    const filteredUsers = usersData
        .filter(user =>
            user.userId.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.userId.logId.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter(user => {
            if (selectedDate) {
                const userDate = new Date(user.createdAt);
                return userDate.toDateString() === selectedDate.toDateString();
            }
            if (selectedMonth) {
                const userDate = new Date(user.createdAt);
                return (
                    userDate.getMonth() === selectedMonth.getMonth() &&
                    userDate.getFullYear() === selectedMonth.getFullYear()
                );
            }
            return true;
        })
        .sort((a, b) => a.userId._id.localeCompare(b.userId._id));

    const totalDonationAmount = filteredUsers.reduce((sum, user) => sum + user.amount, 0);

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    return (
        <div className="container">
            <div className="donation-search">
                <div className="row total-donation">
                    <div className="total-data">
                        <h5>Total Donation</h5>
                        <p>{totalDonationAmount.toFixed(2)}</p>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-9">
                        <h3 className="mb-2">Total Donation</h3>
                        <p className="mb-3">List of all total donations</p>
                    </div>
                    <div className="col-3">
                        <input
                            type="text"
                            placeholder="Search by Name or Log ID"
                            className="form-control mb-3"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Search by Date"
                            className="form-control mb-3"
                        />
                        <DatePicker
                            selected={selectedMonth}
                            onChange={(date) => setSelectedMonth(date)}
                            dateFormat="MM/yyyy"
                            showMonthYearPicker
                            placeholderText="Search by Month"
                            className="form-control mb-3"
                        />
                    </div>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-striped text-center">
                    <thead>
                        <tr>
                            <th scope="col">Sr No</th>
                            <th scope="col">Name</th>
                            <th scope="col">Parent Id</th>
                            <th scope="col">Log Id</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Date / Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.length > 0 ? (
                            currentUsers.map((user, index) => (
                                <tr key={index}>
                                    <th scope="row">{indexOfFirstUser + index + 1}</th>
                                    <td>{user.userId.firstName}</td>
                                    <td>{user.userId.parentId || "---"}</td>
                                    <td>{user.userId.logId}</td>
                                    <td>{user.amount.toFixed(2)}</td>
                                    <td>{new Date(user.createdAt).toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No users found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="d-flex justify-content-center align-items-center">
                <button className="btn btn-next me-2" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button className="btn btn-next ms-2" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default TotalDonation;
