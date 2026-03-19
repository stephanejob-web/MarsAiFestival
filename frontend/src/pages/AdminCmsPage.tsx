import React from "react";
import CmsTopBar from "../features/admin/components/CmsTopBar";
import CmsVideoHero from "../features/admin/components/CmsVideoHero";
import CmsHeroContent from "../features/admin/components/CmsHeroContent";
import CmsCalendar from "../features/admin/components/CmsCalendar";
import CmsJury from "../features/admin/components/CmsJury";
import CmsSponsors from "../features/admin/components/CmsSponsors";
import CmsContactInfo from "../features/admin/components/CmsContactInfo";

const AdminCmsPage = (): React.JSX.Element => {
    return (
        <div className="flex flex-1 flex-col overflow-hidden">
            {/* Topbar of the CMS Admin Area */}
            <div className="flex h-[50px] min-h-[50px] items-center gap-3 border-b border-white/6 bg-surface px-5">
                <span className="font-display text-[0.88rem] font-extrabold text-white-soft">
                    Administration du site
                </span>
                <div className="h-[18px] w-px bg-white/8" />
                <span className="text-[0.75rem] text-mist">
                    Gérez les sections de la page d'accueil
                </span>
                <div className="ml-auto">
                    <span className="rounded-md border border-solar/20 bg-solar/7.000000000000001 px-2.5 py-1 font-mono text-[0.7rem] text-mist">
                        🛡️ Admin
                    </span>
                </div>
            </div>

            {/* Content area matching the layout of the HTML maquette */}
            <div className="flex-1 overflow-y-auto p-6" id="view-site">
                <CmsTopBar />

                <CmsVideoHero />

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <CmsHeroContent />
                    <CmsCalendar />
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <CmsJury />
                    <CmsSponsors />
                </div>

                <CmsContactInfo />
            </div>
        </div>
    );
};

export default AdminCmsPage;
