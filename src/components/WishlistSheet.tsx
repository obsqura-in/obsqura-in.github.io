import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Heart, X, ShoppingBag } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const WishlistSheet = () => {
  const { items, totalItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (item: typeof items[0]) => {
    addToCart({
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      image: item.image,
    });
    removeFromWishlist(item.id);
    toast.success(`${item.name} moved to cart`);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative text-foreground hover:text-primary transition-colors duration-300">
          <Heart className="w-5 h-5" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="bg-background border-border w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl text-foreground flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Your Wishlist
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-8 flex flex-col h-[calc(100vh-200px)]">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
                <Heart className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="font-body text-muted-foreground text-center">
                Your wishlist is empty
              </p>
              <p className="font-body text-sm text-muted-foreground/70 text-center max-w-xs">
                Save pieces from AI recommendations to revisit later
              </p>
              <Link to="/ai-mode">
                <Button variant="outline" className="mt-2">
                  Explore AI Mode
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex-1 overflow-auto space-y-4">
              {items.map((item) => (
                <div key={item.id} className="group bg-card/50 border border-border/50 rounded-xl p-4 hover:border-primary/30 transition-all duration-300">
                  <div className="flex gap-4">
                    <div className="w-20 h-24 bg-card overflow-hidden rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">
                            {item.category}
                          </p>
                          <h4 className="font-display text-lg text-foreground">
                            {item.name}
                          </h4>
                          <p className="font-display text-sm text-primary">
                            ₹{item.price.toLocaleString('en-IN')}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      
                      {item.reason && (
                        <p className="font-body text-xs text-muted-foreground mt-2 line-clamp-2">
                          {item.reason}
                        </p>
                      )}
                      
                      <Button
                        onClick={() => handleMoveToCart(item)}
                        size="sm"
                        className="mt-3 w-full bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/30"
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Move to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {items.length > 0 && (
            <div className="pt-6 border-t border-border mt-auto space-y-3">
              <p className="font-body text-sm text-muted-foreground text-center">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} saved
              </p>
              <Link to="/ai-mode" className="block">
                <Button variant="outline" className="w-full border-primary/30 hover:bg-primary/5">
                  Get More Recommendations
                </Button>
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default WishlistSheet;
