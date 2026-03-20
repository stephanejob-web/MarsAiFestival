import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Formulaire from "./pages/Formulaire";
import Jury from "./pages/Jury";
import JuryPanel from "./pages/JuryPanel";
import AdminPage from "./pages/AdminPage";
import AdminFilmsPage from "./pages/AdminFilmsPage";
import AdminSelectionPage from "./pages/AdminSelectionPage";
import AdminTagsPage from "./pages/AdminTagsPage";
import Layout from "./components/ui/Layout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedAdminRoute from "./components/ui/ProtectedAdminRoute";
import AdminCmsPage from "./pages/AdminCmsPage";

const App = (): React.JSX.Element => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="jury" element={<Jury />} />
                </Route>
                <Route element={<ProtectedAdminRoute />}>
                    <Route path="admin" element={<AdminLayout />}>
                        <Route index element={<AdminPage />} />
                        <Route path="films" element={<AdminFilmsPage />} />
                        <Route
                            path="phases"
                            element={
                                <div className="p-8 text-zinc-500">
                                    Phases & Dates — en construction
                                </div>
                            }
                        />
                        <Route path="selection" element={<AdminSelectionPage />} />
                        <Route path="tags" element={<AdminTagsPage />} />
                        <Route
                            path="awards"
                            element={
                                <div className="p-8 text-zinc-500">
                                    Awards & Sponsors — en construction
                                </div>
                            }
                        />
                        <Route path="/admin/cms" element={<AdminCmsPage />} />
                    </Route>
                </Route>
                <Route path="formulaire" element={<Formulaire />} />
                <Route path="jury/panel" element={<JuryPanel />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
