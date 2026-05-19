import BannerCarousel from "@/components/home/bannerCarousel";
import ProductCard from "@/components/home/productCard";
import SpecialCombos from "@/components/home/specialCombos";

export default function HomePage() {
  return (
    <div>
      <BannerCarousel />
      <SpecialCombos />
      <ProductCard heading="BEST SELLERS" />
    </div>
  );
}
