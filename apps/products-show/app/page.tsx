import CarouselImage from "@/components/Home/CarouselImage";
import ContactUs from "@/components/Home/ContactUs";
import ProductList from "@/components/Home/ProductList";

export default function Home() {
  return (
    <div className="w-full pb-[50px] pt-4 x-px-20">
      <CarouselImage />
      <ProductList />
      <ContactUs />
    </div>
  );
}
