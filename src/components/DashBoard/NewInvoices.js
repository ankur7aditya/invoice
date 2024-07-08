import React, { useState } from "react";
import { db, auth } from "../../firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function NewInvoices() {
  const navigate = useNavigate();
  const [to, setTo] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [invoice, setInvoice] = useState([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);

  const handleAddProduct = () => {
    if (item !== "" && price > 0 && quantity > 0) {
      setInvoice([
        ...invoice,
        { itemName: item, price: price, quantity: quantity },
      ]);
      setTotal(total + price * quantity);
      setItem("");
      setPrice("");
      setQuantity("");
    } else {
      setError("Please fill out all product fields with valid values.");
    }
  };

  const handleDelete = (indexRemove) => {
    setInvoice((prevInvoice) =>
      prevInvoice.filter((_, index) => index !== indexRemove)
    );
    const removedItem = invoice[indexRemove];
    setTotal(total - removedItem.price * removedItem.quantity);
  };

  const handleEdit = (indexEdit) => {
    const obj = invoice[indexEdit];
    setItem(obj.itemName);
    setPrice(obj.price);
    setQuantity(obj.quantity);
    handleDelete(indexEdit);
  };

  const handleSaveData = async () => {
    if (to !== "" && contact !== "" && address !== "" && invoice.length > 0) {
      try {
        const user = auth.currentUser;
        if (user) {
          const userId = user.uid;
          const invoiceData = {
            to: to,
            contact: contact,
            address: address,
            invoice: invoice,
            total: total,
            date: Timestamp.fromDate(new Date()),
          };

          const docRef = await addDoc(
            collection(db, `users/${userId}/invoices`),
            invoiceData
          );
          console.log("Invoice stored successfully with ID: ", docRef.id);
          navigate("/dashboard/invoices");
        } else {
          setError("User is not authenticated. Please log in.");
        }
      } catch (error) {
        console.error("Error storing invoice: ", error);
        setError("Failed to store invoice. Please try again.");
      }
    } else {
      setError("Please fill out all fields and add at least one product.");
    }
  };

  return (
    <>
      <div className="invoice-header flex justify-between mb-4">
        <p className="text-3xl font-bold">New Invoice</p>
        <button
          onClick={handleSaveData}
          className="bg-green-500 p-2 rounded-md hover:bg-blue-900"
        >
          Save Data
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="invoice-form1 lg:flex lg:justify-between lg:gap-1 sm:flex-row sm:mt-10">
        <input
          type="text"
          name="to"
          id="to"
          placeholder="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="bg-gray-200 border-2 border-black rounded-md w-full mb-4 lg:mb-0 focus:border-blue-500 outline-none placeholder:px-2"
        />
        <input
          type="number"
          name="contact"
          id="contact"
          placeholder="Contact"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="bg-gray-200 border-2 border-black rounded-md w-full mb-4 lg:mb-0 focus:border-blue-500 outline-none placeholder:px-2"
        />
        <input
          type="text"
          name="address"
          id="address"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="bg-gray-200 border-2 border-black rounded-md w-full mb-4 lg:mb-0 focus:border-blue-500 outline-none placeholder:px-2"
        />
      </div>
      <div className="invoice-form2 lg:flex lg:justify-between lg:gap-1 sm:flex-row sm:mt-2 focus:border-blue-500 outline-none">
        <input
          type="text"
          name="item-name"
          id="item-name"
          placeholder="Item Name"
          value={item}
          onChange={(e) => setItem(e.target.value)}
          className="bg-gray-200 border-2 border-black rounded-md w-full mb-4 lg:mb-0 focus:border-blue-500 outline-none placeholder:px-2"
        />
        <input
          type="number"
          name="price"
          id="price"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="bg-gray-200 border-2 border-black rounded-md w-full mb-4 lg:mb-0 focus:border-blue-500 outline-none placeholder:px-2"
        />
        <input
          type="number"
          name="quantity"
          id="quantity"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="bg-gray-200 border-2 border-black rounded-md w-full mb-4 lg:mb-0 focus:border-blue-500 outline-none placeholder:px-2"
        />
      </div>

      <button
        onClick={handleAddProduct}
        className="bg-blue-500 rounded-md p-2 mt-5 font-bold hover:bg-blue-950"
      >
        Add Product
      </button>
      <div className="invoice-brief bg-slate-200 mt-5">
        <h1 className="text-4xl font-bold text-center mb-4">Invoice Brief</h1>
        <div className="flex text-gray-900 sm:text-xl lg:text-2xl bg-slate-100">
          <p className="font-bold w-1/6 flex-grow overflow-auto break-words">
            S.No
          </p>
          <p className="font-bold w-1/6 flex-grow overflow-auto break-words">
            Product Name
          </p>
          <p className="font-bold w-1/6 flex-grow overflow-auto break-words">
            Price
          </p>
          <p className="font-bold w-1/6 flex-grow overflow-auto break-words">
            Quantity
          </p>
          <p className="font-bold w-1/6 flex-grow overflow-auto break-words">
            Sub-Total
          </p>
          <p className="font-bold w-1/6 flex-grow overflow-auto break-words"></p>
        </div>
        <div className="invoice-brief2 items-center mt-5">
          {invoice.map((item, index) => (
            <div key={index} className="flex text-gray-800">
              <p className="font-semibold bg-slate-100 w-1/6 flex-grow overflow-auto break-words">
                {index + 1}
              </p>
              <p className="font-semibold bg-slate-100 w-1/6 flex-grow overflow-auto break-words">
                {item.itemName}
              </p>
              <p className="font-semibold bg-slate-100 w-1/6 flex-grow overflow-auto break-words">
                {item.price}
              </p>
              <p className="font-semibold bg-slate-100 w-1/6 flex-grow overflow-auto break-words">
                {item.quantity}
              </p>
              <p className="font-semibold bg-slate-100 w-1/6 flex-grow overflow-auto break-words">
                {item.quantity * item.price}
              </p>
              <div className="flex-grow overflow-auto break-words">
                <button
                  onClick={() => handleEdit(index)}
                  className="p-2 rounded bg-blue-300"
                >
                  <img
                    src={require("../../Assets/edit.png")}
                    alt="edit-icon"
                    className="w-6 h-6"
                  />
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="p-2 rounded bg-red-700"
                >
                  <img
                    src={require("../../Assets/delete.png")}
                    alt="delete-icon"
                    className="w-6 h-6"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
        <p className="text-right text-blue-950 px-3 mt-2 font-bold lg:text-3xl lg:px-10">
          Total : {total}
        </p>
      </div>
    </>
  );
}

export default NewInvoices;
