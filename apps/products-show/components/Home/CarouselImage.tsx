import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getBannerImages } from "@/utils/baseData";
import Image from "next/image";

export default function CarouselImage() {
  const imgs = getBannerImages();
  return (
    <Carousel className="w-full h-full hidden-btn" opts={{ loop: true }}>
      <CarouselContent>
        {imgs.map((_, index) => (
          <CarouselItem key={index}>
            <div className="w-full h-full flex justify-center items-center">
              <Image
                src={_}
                alt="banner"
                width={1024}
                height={0}
                className="w-full"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
