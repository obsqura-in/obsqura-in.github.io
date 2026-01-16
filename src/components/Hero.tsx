import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

interface HeroProps {
  heroImage: string;
}

const Hero = ({ heroImage }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Luxury jewelry"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="font-body text-xs tracking-[0.4em] uppercase text-primary mb-6 opacity-0 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            Artisanal Jewelry
          </p>
          
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light text-foreground mb-8 opacity-0 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            Where Mystery
            <br />
            <span className="italic text-gradient-gold">Meets Elegance</span>
          </h1>
          
          <p className="font-body text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-12 opacity-0 animate-slide-up" style={{ animationDelay: "0.6s" }}>
            Handcrafted pieces that transcend time, each jewel telling a story of 
            hidden beauty and timeless sophistication.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-slide-up" style={{ animationDelay: "0.8s" }}>
            <Button variant="hero" size="xl">
              Explore Collection
            </Button>
            <Button variant="minimal" size="lg">
              Our Story
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-0 animate-slide-up" style={{ animationDelay: "1s" }}>
        <a href="#collections" className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors duration-300">
          <span className="font-body text-xs tracking-[0.2em] uppercase mb-3">Discover</span>
          <ArrowDown size={20} className="animate-bounce" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
