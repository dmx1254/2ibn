import HeroSection from "./components/HeroSection";
import OurServices from "./components/OurServices";
import WhyChooseUs from "./components/WhyChooseUs";

export default async function Home() {
  return (
    <div className="font-poppins relative w-full max-w-6xl flex flex-col items-center justify-center mx-auto min-h-screen p-4 my-10">
      <main className="flex flex-col items-center justify-center gap-20">
        <div className="bg-[#1A1D21] p-2 lg:p-8 rounded-[10px] max-lg:-mt-4">
          <HeroSection />
        </div>
        <div className="bg-[#1A1D21] rounded-[10px]">
          <OurServices />
        </div>
        <div className="bg-[#1A1D21] p-4 rounded-[10px]">
          <WhyChooseUs />
        </div>
      </main>
    </div>
  );
}
