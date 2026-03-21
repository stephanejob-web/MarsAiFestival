import React from "react";
import CmsProgramme from "../features/admin/components/CmsProgramme";
import CmsJury from "../features/admin/components/CmsJury";

interface SectionTitleProps {
    icon: string;
    title: string;
    subtitle: string;
}

const SectionTitle = ({ icon, title, subtitle }: SectionTitleProps): React.JSX.Element => (
    <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <div>
            <div className="font-display text-[0.95rem] font-extrabold text-white-soft">{title}</div>
            <div className="text-[0.72rem] text-mist">{subtitle}</div>
        </div>
    </div>
);

const Divider = (): React.JSX.Element => (
    <div className="my-6 h-px w-full bg-white/[0.05]" />
);

const AdminCmsPage = (): React.JSX.Element => {
    return (
        <div className="flex flex-1 flex-col overflow-hidden">
            {/* Topbar */}
            <div className="flex h-[50px] min-h-[50px] items-center gap-3 border-b border-white/[0.06] bg-surface px-5">
                <span className="font-display text-[0.88rem] font-extrabold text-white-soft">
                    Administration du site
                </span>
                <div className="h-[18px] w-px bg-white/[0.08]" />
                <span className="text-[0.75rem] text-mist">
                    Gérez le contenu public du festival
                </span>
                <div className="ml-auto">
                    <span className="rounded-md border border-solar/20 bg-solar/[0.07] px-2.5 py-1 font-mono text-[0.7rem] text-mist">
                        🛡️ Admin
                    </span>
                </div>
            </div>

            {/* Quick nav */}
            <div className="flex items-center gap-2 border-b border-white/[0.04] bg-surface/60 px-5 py-2">
                <span className="text-[0.68rem] text-mist/50 uppercase tracking-widest font-mono mr-1">Aller à :</span>
                <a
                    href="#cms-programme"
                    className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-[0.72rem] text-mist transition-all hover:border-aurora/30 hover:text-aurora"
                >
                    Programme 🗓️
                </a>
                <a
                    href="#cms-jury"
                    className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-[0.72rem] text-mist transition-all hover:border-aurora/30 hover:text-aurora"
                >
                    Jury 👥
                </a>
            </div>

            {/* Contenu */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
                <section id="cms-programme">
                    <SectionTitle
                        icon="🗓️"
                        title="Programme · Festival"
                        subtitle="Événements affichés sur la page programme du site"
                    />
                    <div className="mt-4">
                        <CmsProgramme />
                    </div>
                </section>

                <Divider />

                <section id="cms-jury">
                    <SectionTitle
                        icon="👥"
                        title="Jury · Page d'accueil"
                        subtitle="Membres du jury affichés publiquement sur le site"
                    />
                    <div className="mt-4">
                        <CmsJury />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminCmsPage;
