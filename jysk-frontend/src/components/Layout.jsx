// src/components/Layout.jsx
// Спільна обгортка сторінок: шапка, контент (Outlet), підвал.

import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import PageTransition from "./PageTransition";

const Layout = () => (
  <>
    <PageTransition />
    <Header />
    <main className="page">
      <Outlet />
    </main>
    <Footer />
  </>
);

export default Layout;
