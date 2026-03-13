import React from "react";
import HeroSection from "../features/home/components/HeroSection";
import ConceptSection from "../features/home/components/ConceptSection";
import ManifesteSection from "../features/home/components/ManifesteSection";
import AboutSection from "../features/home/components/AboutSection";
import HowSection from "../features/home/components/HowSection";
import ProgrammeSection from "../features/home/components/ProgrammeSection";
import FilmsSection from "../features/home/components/FilmsSection";
import GalaSection from "../features/home/components/GalaSection";
import HomeFooter from "../features/home/components/HomeFooter";

const Divider = (): React.JSX.Element => (
    <div
        className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mx-12"
        aria-hidden="true"
    />
);

const Home = (): React.JSX.Element => (
    <>
        <HeroSection />
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
        <FilmsSection />
        <Divider />
        <GalaSection />
        <HomeFooter />
    </>
);

export default Home;
