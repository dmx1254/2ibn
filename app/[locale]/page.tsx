import HomeSlider from "./components/HomeSlider";
import OurServices from "./components/OurServices";
import WhyChooseUs from "./components/WhyChooseUs";
import HomePageIcon from "./components/HomePageIcon";
import Testimonials from "./components/Testimonials";
import UserComment from "./components/UserComment";

export default async function Home() {
  return (
    <div className="font-poppins relative w-full flex flex-col items-center justify-center mx-auto min-h-screen">
      <main className="w-full flex flex-col items-center justify-center">
        <div className="w-full hidden md:flex">
          <HomeSlider />
        </div>
        <div className="w-full max-w-6xl my-2 md:mt-40">
          <HomePageIcon />
        </div>

        <div className="w-full max-w-6xl my-5">
          <Testimonials />
        </div>
        <div className=" w-full max-w-6xl bg-[#1A1D21] rounded-[10px] my-10">
          <OurServices />
        </div>
        <div className=" w-full max-w-6xl bg-[#1A1D21] rounded-[10px] my-10">
          <WhyChooseUs />
        </div>
        <div className="w-full max-w-6xl bg-[#1A1D21] rounded-[10px] my-10">
          <UserComment />
        </div>
      </main>
    </div>
  );
}
