import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Card = () => {
  const [totalDonors, setTotalDonors] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);
  const [totalEarning, setTotalEarning] = useState(0);
  const [totalWithdrawal, setTotalWithdrawal] = useState(0);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://api.saibalikavikas.com/api/all-donatation');
      if (response.status === 200) {
        const data = response.data.data;

        // Calculate total donors and total donations
        const uniqueDonors = new Set(data.map(item => item.userId._id));
        setTotalDonors(uniqueDonors.size);

        const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);
        setTotalDonations(totalAmount);

        // Assuming totalEarning and totalWithdrawal are part of the API response
        // If not, you can calculate or set them as needed
        setTotalEarning(0); // Set this based on your logic or API response
        setTotalWithdrawal(0); // Set this based on your logic or API response
      }
    } catch (error) {
      console.error("Error fetching donation data:", error);
      Swal.fire("Error", "Failed to fetch donation data.", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container pt-5">
      <div className="row align-items-stretch">
        <div className="c-dashboardInfo col-lg-3 col-md-6">
          <div className="wrap">
            <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">
              Total Donors
            </h4>
            <span className="hind-font caption-12 c-dashboardInfo__count">{totalDonors}</span>
          </div>
        </div>
        <div className="c-dashboardInfo col-lg-3 col-md-6">
          <div className="wrap">
            <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">Total Donations</h4>
            <span className="hind-font caption-12 c-dashboardInfo__count">&#8377;{totalDonations.toFixed(2)}</span>
            <span className="hind-font caption-12 c-dashboardInfo__subInfo">Last month: &#8377;30</span>
          </div>
        </div>
        <div className="c-dashboardInfo col-lg-3 col-md-6">
          <div className="wrap">
            <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">Total Earning</h4>
            <span className="hind-font caption-12 c-dashboardInfo__count">&#8377;{totalEarning.toFixed(2)}</span>
          </div>
        </div>
        <div className="c-dashboardInfo col-lg-3 col-md-6">
          <div className="wrap">
            <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">Total Withdrawal</h4>
            <span className="hind-font caption-12 c-dashboardInfo__count">&#8377;{totalWithdrawal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
