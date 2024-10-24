import HeroSection from "@/components/HeroSection";

export default function Home() {
  return (
    <div className="font-poppins relative w-full max-w-6xl flex flex-col items-center justify-center mx-auto min-h-screen p-4">
      <main className="flex flex-col items-start gap-20 lg:-mt-20">
        <HeroSection />
      </main>
    </div>
  );
}
