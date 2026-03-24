import React from "react";
import HeroSection from "../features/home/components/HeroSection";
import TickerSection from "../features/home/components/TickerSection";
import ConceptSection from "../features/home/components/ConceptSection";
import ManifesteSection from "../features/home/components/ManifesteSection";
import AboutSection from "../features/home/components/AboutSection";
import HowSection from "../features/home/components/HowSection";
import ProgrammeSection from "../features/home/components/ProgrammeSection";
import FilmsSection from "../features/home/components/FilmsSection";
import GalaSection from "../features/home/components/GalaSection";
import SponsorsSection from "../features/home/components/SponsorsSection";
import HomeFooter from "../features/home/components/HomeFooter";
import SelectionGrid from "../features/home/components/SelectionGrid";
import FinalistGrid from "../features/home/components/FinalistGrid";
import PalmaresSection from "../features/home/components/PalmaresSection";
import { usePhase } from "../features/home/hooks/usePhase";

const Divider = (): React.JSX.Element => (
    <div
        className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mx-12"
        aria-hidden="true"
    />
);

const Home = (): React.JSX.Element => {
    const { phase } = usePhase();

    return (
        <>
            <HeroSection />
            <TickerSection />
            <Divider />
            <ConceptSection />
            <Divider />
            <ManifesteSection />
            <Divider />
            <AboutSection />
            <Divider />
            <HowSection />
            <Divider />
            <ProgrammeSection />
            <Divider />

            {/* Section dynamique selon la phase active */}
            {phase.phase === 0 && <FilmsSection />}
            {phase.phase === 1 && <SelectionGrid />}
            {phase.phase === 2 && <FinalistGrid />}
            {phase.phase === 3 && <PalmaresSection />}

            <Divider />
            <GalaSection />
            <Divider />
            <SponsorsSection />
            <HomeFooter />
        </>
    );
};

export default Home;
