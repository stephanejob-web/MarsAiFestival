import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Formulaire from "./pages/Formulaire";
import Jury from "./pages/Jury";
import JuryPanel from "./pages/JuryPanel";
import AdminPanel from "./pages/AdminPanel";
import Layout from "./components/ui/Layout";

const App = (): React.JSX.Element => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="jury" element={<Jury />} />
                    <Route path="jury/panel" element={<JuryPanel />} />
                    <Route path="admin" element={<AdminPanel />} />
                </Route>
                <Route path="formulaire" element={<Formulaire />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
