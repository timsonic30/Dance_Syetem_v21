"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "./BuyClass.css";

export default function BuyClass() {
  const [products, setProducts] = useState([]);
  const [monthlyPass, setMonthlyPass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isMonthlyPassActive, setMonthlyPassActive] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3030/payProduct");
        const data = await response.json();

        if (!data.payProductData || !Array.isArray(data.payProductData)) {
          throw new Error("Invalid product data format");
        }

        const classes = data.payProductData
          .filter((item) => item.productName.includes("Class"))
          .sort((a, b) => extractClassNumber(a.productName) - extractClassNumber(b.productName))
          .map((item) => formatProduct(item));

        const pass = data.payProductData.find(
          (item) => item.productName === "Monthly pass Package"
        );

        setProducts(classes);
        setMonthlyPass(pass ? formatProduct(pass) : null);
      } catch (error) {
        console.error("Error fetching products:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const extractClassNumber = (name) => parseInt(name.match(/\d+/)?.[0] || 0, 10);

  const formatProduct = (item) => ({
    id: item._id,
    name: item.productName,
    description: item.description,
    price: item.price,
    points: item.point,
    validDate: item.ValidDate,
    img: item.img || "./images/default-image.jpeg",
  });

  const handleSelectProduct = (id, isPass = false) => {
    setSelectedProductId(isPass ? null : id);
    setMonthlyPassActive(isPass);
  };

  const activeProduct = products.find((product) => product.id === selectedProductId);

  if (loading) return <p>Loading products...</p>;

  return (
    <section className="BuyClassShow" id="BuyClassShow">
      <div className="box-container">
        {/* Header Section */}
        <div className="boxMain">
          <img src="./cards04.jpeg" alt="Buy Class Section" />
          <h1>Buy Class</h1>
        </div>

        {/* Class Products Section */}
        <div className="AllPriceTag">
          {products.map((product) => (
            <div
              key={product.id}
              className={`boxPrice ${selectedProductId === product.id ? "active" : ""}`}
              onClick={() => handleSelectProduct(product.id)}
            >
              <h1>{product.name}</h1>
              <h2>${product.price}</h2>
            </div>
          ))}
        </div>

        {/* Monthly Pass Section */}
        {monthlyPass && (
          <div
            className={`SpecialPro ${isMonthlyPassActive ? "active" : ""}`}
            onClick={() => handleSelectProduct(null, true)}
          >
            <h1>{monthlyPass.name} (30 Days)</h1>
            <h2>${monthlyPass.price}</h2>
            <p>{monthlyPass.description}</p>
          </div>
        )}
      </div>

      {/* Calculation Section */}
      {(selectedProductId || isMonthlyPassActive) && (
        <section className="calculate">
          <hr />
          <table>
            <thead>
              <tr>
                <th colSpan="3">
                  <h1>Your Order</h1>
                </th>
              </tr>
            </thead>
            <tbody>
              {activeProduct ? (
                <>
                  <tr>
                    <td>
                      <h2>{activeProduct.name}:</h2>
                    </td>
                    <td>${activeProduct.price}</td>
                  </tr>
                  <tr>
                    <td>
                      <h2>Price per Class:</h2>
                    </td>
                    <td>${Math.round(activeProduct.price / extractClassNumber(activeProduct.name))}</td>
                  </tr>
                  <tr>
                    <td>
                      <h3>Total:</h3>
                    </td>
                    <td>
                      <h3>${activeProduct.price}</h3>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3">
                      <span>{activeProduct.description}</span>
                    </td>
                  </tr>
                </>
              ) : (
                <>
                  <tr>
                    <td>
                      <h2>{monthlyPass.name} (30 Days):</h2>
                    </td>
                    <td>${monthlyPass.price}</td>
                  </tr>
                  <tr>
                    <td>
                      <h3>Total:</h3>
                    </td>
                    <td>
                      <h3>${monthlyPass.price}</h3>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3">
                      <span>{monthlyPass.description}</span>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
          <hr />
        </section>
      )}

      {/* Bottom Action Buttons */}
      <section className="BuyClassButton">
        <div className="bottom-buttons">
          <button className="AddToCart-btn" onClick={() => console.log("Add to Cart clicked!")}>
            Add to Cart
          </button>
          <a
            href="https://wa.me/your-whatsapp-number"
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-btn"
          >
            <img
              src="./WhatsAppWhite.png"
              alt="WhatsApp Icon"
              style={{ width: "25px", height: "25px" }}
            />
            WhatsApp Inquiries
          </a>
          <button className="BookTheClass-btn">
            <Link href="/tutor" aria-label="Tutor Page">
              Book the Class
            </Link>
          </button>
        </div>
      </section>
    </section>
  );
}
