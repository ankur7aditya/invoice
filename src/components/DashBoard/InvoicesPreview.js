import React from "react";
import { useLocation } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function InvoicesPreview() {
  const location = useLocation();
  const data = location.state;

  const handlePrint = () => {
    const content = document.getElementById("invoice");

    html2canvas(content, {
      scale: 2, // Increase scale to improve quality
      useCORS: true, // Ensure that external images are rendered
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(
        `invoice-${data.to}-${new Date(
          data.date.seconds * 1000
        ).toLocaleDateString()}.pdf`
      );
    });
  };

  return (
    <>
      <div className="flex justify-end">
        <button
          onClick={handlePrint}
          className="bg-blue-950 rounded-md text-white text-2xl p-3"
        >
          Print Invoice
        </button>
      </div>
      <div
        id="invoice"
        className="bg-white sm:w-full mt-5 lg:mt-1 lg:w-3/5 lg:m-auto p-4"
        style={{
          fontFamily: "Arial, sans-serif",
          color: "#000",
          backgroundColor: "#fff",
        }}
      >
        {/* Header with Customer and Company Details */}
        <div className="header flex justify-between mb-4">
          <div className="left">
            <img
              className="h-20 w-20 rounded-full shadow-lg"
              src={localStorage.getItem("logo") || ""}
              alt="company-logo"
              onLoad={() => console.log("Image loaded")}
            />
            <p className="text-2xl font-semibold">
              {localStorage.getItem("user") || ""}
            </p>
            <p>{localStorage.getItem("email") || ""}</p>
          </div>
          <div className="right text-right">
            <p className="text-4xl text-blue-800 font-semibold">Invoice</p>
            <p>To: {data.to}</p>
            <p>Address: {data.address}</p>
            <p>Contact: {data.contact}</p>
          </div>
        </div>
        {/* Table of content */}
        <table className="w-full border-collapse" style={{ width: "100%" }}>
          <thead className="bg-blue-500">
            <tr>
              <th className="border border-black">S.No</th>
              <th className="border border-black">Product Name</th>
              <th className="border border-black">Price</th>
              <th className="border border-black">Quantity</th>
              <th className="border border-black">Sub-Total</th>
            </tr>
          </thead>
          <tbody>
            {data.invoice.map((item, index) => (
              <tr key={index}>
                <td className="border border-black">{index + 1}</td>
                <td className="border border-black">{item.itemName}</td>
                <td className="border border-black">{item.price}</td>
                <td className="border border-black">{item.quantity}</td>
                <td className="border border-black">
                  {item.price * item.quantity}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-blue-500">
            <tr>
              <td
                colSpan="4"
                className="border border-black text-right font-semibold"
              >
                Total:
              </td>
              <td className="border border-black font-semibold">
                {data.total}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}

export default InvoicesPreview;
