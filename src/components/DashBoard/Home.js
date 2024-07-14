import { collection, getDocs } from "firebase/firestore";
import React, { useState, useEffect, useRef } from "react";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";

function Home() {
  const [total, setTotal] = useState(0);
  const [totalMonth, setTotalMonth] = useState(0);
  const [invoiceData, setInvoiceData] = useState([]);
  const navigator = useNavigate();
  const chartRef = useRef(null); // Reference to store the Chart instance

  // Function to get invoice details
  const getData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        const userInvoicesRef = collection(db, `users/${userId}/invoices`);

        const querySnapshot = await getDocs(userInvoicesRef);
        const invoices = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInvoiceData(invoices);
        console.log(invoices);
        totalCount(invoices);
        monthTotal(invoices);
        aggregateMonthlyTotals(invoices);
      } else {
        console.error("User not authenticated.");
      }
    } catch (error) {
      console.error("Error retrieving invoices: ", error);
    }
  };

  // Calculating total amount
  const totalCount = (invoiceData) => {
    let t = 0;
    invoiceData.forEach((item) => {
      t += item.total;
    });

    setTotal(t);
  };

  // Calculate current month total amount
  const monthTotal = (invoiceData) => {
    let t = 0;
    invoiceData.forEach((item) => {
      const invoiceDate = new Date(item.date.seconds * 1000);
      if (
        invoiceDate.getMonth() === new Date().getMonth() &&
        invoiceDate.getFullYear() === new Date().getFullYear()
      ) {
        t += item.total;
      }
    });
    setTotalMonth(t);
  };

  const aggregateMonthlyTotals = (invoices) => {
    const monthlyTotals = {};
    invoices.forEach((invoice) => {
      const date = new Date(invoice.date.seconds * 1000); // Assuming date is stored as seconds
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;

      if (!monthlyTotals[monthYear]) {
        monthlyTotals[monthYear] = 0;
      }
      monthlyTotals[monthYear] += invoice.total;
    });

    renderChart(monthlyTotals);
  };

  const renderChart = (monthlyTotals) => {
    const ctx = document.getElementById("myChart");

    if (chartRef.current) {
      chartRef.current.destroy(); // Destroy the existing chart instance
    }

    // Sort the months in chronological order
    const sortedMonths = Object.keys(monthlyTotals).sort((a, b) => {
      const [monthA, yearA] = a.split("/").map(Number);
      const [monthB, yearB] = b.split("/").map(Number);
      return yearA - yearB || monthA - monthB;
    });

    const labels = sortedMonths;
    const data = sortedMonths.map((month) => monthlyTotals[month]);

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Monthly Invoice Totals",
            data: data,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {/* Header to contain 3 boxes for total amount,Total Invoices, Monthly Total */}
      <div className="header lg:flex lg:justify-between lg:h-1/3">
        <div className="text-white flex items-center justify-center mb-5 h-20 lg:h-full lg:w-1/3 lg:mr-4 bg-gradient-to-r from-black to-blue-400 rounded-lg">
          <div>
            <p className="text-3xl">Rs.{total}</p>
            <p className="text-yellow-400 font-semibold">Total</p>
          </div>
        </div>
        <div className="text-white flex items-center justify-center mb-5 h-20 lg:h-full lg:w-1/3 lg:mr-4 bg-gradient-to-r from-black to-red-400 rounded-lg">
          <div>
            <p className="text-3xl">{invoiceData.length}</p>
            <p className="text-yellow-400 font-semibold">Invoices</p>
          </div>
        </div>
        <div className="text-white flex items-center justify-center mb-5 h-20 lg:h-full lg:w-1/3 lg:mr-4 bg-gradient-to-r from-black to-gray-400 rounded-lg">
          <div>
            <p className="text-3xl">Rs.{totalMonth}</p>
            <p className="text-yellow-400 font-semibold">
              Month Total ({new Date().getMonth() + 1}/
              {new Date().getFullYear()})
            </p>
          </div>
        </div>
      </div>

      {/* Hero Section with GRAPH and INVOICES */}
      <div className="home-hero-section lg:flex h-1/2 mt-8">
        {/* GRAPH */}
        <div className="graph sm:w-full h-full lg:w-2/3 lg:mr-5 bg-gray-200 rounded-lg ">
          <canvas id="myChart"></canvas>
        </div>

        {/* Invoices Details */}
        <div className="recent-invoices sm:w-full mt-5 lg:mt-0 h-full lg:w-1/3 bg-white rounded-lg overflow-auto">
          <p className="text-2xl p-3 bg-blue-700 text-center rounded-t-lg">
            Recent Invoices
          </p>
          <div
            onClick={() => {
              navigator("/dashboard/invoices");
            }}
            className="invoices cursor-pointer"
          >
            {invoiceData
              .sort((a, b) => b.date.seconds - a.date.seconds)
              .map((item, index) => (
                <div
                  key={item.id}
                  className="flex justify-between mb-2 bg-white p-4 rounded-2xl"
                >
                  <p>{index + 1}</p>
                  <p>{item.to}</p>
                  <p>Rs.{item.total}</p>
                  <p>
                    {new Date(item.date.seconds * 1000).toLocaleDateString()}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
