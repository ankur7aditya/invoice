import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

function Invoices() {
  const [invoiceData, setInvoiceData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleDelete = async (invoiceId) => {
    const userConfirmed = window.confirm(
      "Are you sure you want to delete this invoice?"
    );
    if (userConfirmed) {
      try {
        const user = auth.currentUser;
        if (user) {
          const userId = user.uid;
          await deleteDoc(doc(db, `users/${userId}/invoices`, invoiceId));
          setInvoiceData((prevData) =>
            prevData.filter((invoice) => invoice.id !== invoiceId)
          );
        } else {
          console.error("User not authenticated.");
        }
      } catch (error) {
        console.error("Error deleting invoice: ", error);
      }
    }
  };

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
        setLoading(false);
      } else {
        setLoading(false);
        console.error("User not authenticated.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error retrieving invoices: ", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <h1 className="text-center text-4xl text-bold mb-5">Invoices</h1>
      {isLoading ? (
        <i className="fa-solid fa-spinner fa-spin-pulse"></i>
      ) : (
        <div className="invoice-details">
          {invoiceData.map((item, index) => (
            <div
              key={item.id}
              className="flex justify-between mb-2 bg-white p-4 rounded-2xl"
            >
              <p>{index + 1}</p>
              <p>{item.to}</p>
              <p>{item.total}</p>
              <p>{new Date(item.date.seconds * 1000).toLocaleDateString()}</p>
              <div className="text-gray-100">
                <button
                  onClick={() =>
                    navigate("/dashboard/invoicepreview", { state: item })
                  }
                  className="bg-blue-700 text-semibold p-1 rounded-md ml-1"
                >
                  View
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-700 text-semibold p-1 rounded-md ml-1"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          <div>
            <button
              onClick={() => navigate("/dashboard/newinvoices")}
              className="bg-green-800 text-semibold p-2 rounded-md"
            >
              Add Invoice
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Invoices;
