////////////////////////////////////////////////
import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DarkModeProvider, useDarkMode } from "./DarkModeContext";
import Home from "./Home";
import Catalog from "./Catalog/Catalog";
import Cart from "./Cart/Cart";
// import Admin from "./Admin/Admin";
import Payment from "./Payment/Payment";
import LogIn from "./LogIn/LogIn";
import ContactForm from "./ContactForm/ContactForm";
import ProfilePage from "./Profilepage/Profilepage";
import Register from "./Register/Register";
import Details from "./Details/Details";
import Header from "./component/Header/Header";
import ShopOwnerRegistration from "./Register/ShopOwnerRegistration";
import Dashboard from "./DashboardShop/Dashboard";
// import Footer from "./component/Footer/Footer";
import { CartProvider } from "./CartContext/CartContext";
import CarCenterFinder from "./CarCenter/CarCenter";
import PaymentSuccess from "../src/component/PaymentSuccess";
import AddProductPage from "./DashboardShop/AddProductPage";
import Layout from "./DashboardShop/Layout";
import ProductListPage from "./DashboardShop/ProductListPage";
import Orders from "./DashboardShop/Orders";
import ShopOwnerProfile from "./DashboardShop/shopOwnerProfile";

const App = () => {
  return (
    <CartProvider>
      <DarkModeProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </DarkModeProvider>
    </CartProvider>
  );
};

const AppContent = () => {
  const { darkMode } = useDarkMode();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <>
      {/* <Header /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/cart" element={<Cart />} />
        {/* <Route path="/admin" element={<Admin />} /> */}
        {/* <Route path="/Menu/Cart/payment" element={<Payment />} /> */}
        <Route path="/payment" element={<Payment />} />

        <Route path="/login" element={<LogIn />} />
        <Route path="/ContactForm" element={<ContactForm />} />
        <Route path="/ProfilePage" element={<ProfilePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/shopowner" element={<ShopOwnerRegistration />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/carcenter" element={<CarCenterFinder />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />

        {/* //Dashboard// */}
        <Route element={<Layout />}>
          <Route path="/addproduct" element={<AddProductPage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<ShopOwnerProfile />} />
          <Route path="/" element={<AddProductPage />} />
        </Route>

        {/* //End dashboard// */}
      </Routes>
      {/*
      <Footer />
      */}
    </>
  );
};

export default App;
