import HeroSection from "./components/HeroSection";
import OurServices from "./components/OurServices";
import WhyChooseUs from "./components/WhyChooseUs";

export default async function Home() {
  return (
    <div className="font-poppins relative w-full max-w-6xl flex flex-col items-center justify-center mx-auto min-h-screen p-4 my-10">
      <main className="flex flex-col items-start gap-20">
        <HeroSection />
        <WhyChooseUs />
        <OurServices />
      </main>
    </div>
  );
}
