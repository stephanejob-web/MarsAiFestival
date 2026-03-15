import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Formulaire from "./pages/Formulaire";
import Jury from "./pages/Jury";
import JuryPanel from "./pages/JuryPanel";
import AdminPage from "./pages/AdminPage";
import AdminFilmsPage from "./pages/AdminFilmsPage";
import Layout from "./components/ui/Layout";

const App = (): React.JSX.Element => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="jury" element={<Jury />} />
                    <Route path="admin" element={<AdminPage />} />
                    <Route path="admin/films" element={<AdminFilmsPage />} />
                </Route>
                <Route path="formulaire" element={<Formulaire />} />
                <Route path="jury/panel" element={<JuryPanel />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
