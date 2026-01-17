import { Button } from "@/components/ui/button";
interface HeroProps {
  heroImage: string;
}
const Hero = ({
  heroImage
}: HeroProps) => {
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="Luxury jewelry" className="w-full h-full object-cover opacity-60 scale-105 animate-[scale-in_2s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center">
        
      </div>
    </section>;
};
export default Hero;