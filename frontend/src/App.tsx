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
import ProtectedJuryRoute from "./components/ui/ProtectedJuryRoute";
import AdminCmsPage from "./pages/AdminCmsPage";
import AdminDocsPage from "./pages/AdminDocsPage";
import AdminEmailingPage from "./pages/AdminEmailingPage";
import NotFound from "./pages/NotFound";

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
                        <Route path="selection" element={<AdminSelectionPage />} />
                        <Route path="tags" element={<AdminTagsPage />} />
                        <Route path="/admin/cms" element={<AdminCmsPage />} />
                        <Route path="docs" element={<AdminDocsPage />} />
                        <Route path="emailing" element={<AdminEmailingPage />} />
                    </Route>
                </Route>
                <Route path="formulaire" element={<Formulaire />} />
                <Route element={<ProtectedJuryRoute />}>
                    <Route path="jury/panel" element={<JuryPanel />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
