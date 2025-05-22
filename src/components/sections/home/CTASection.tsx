import Image from "next/image";

export const CTASection = () => {
  return (
    <section className="relative h-full">
      <div className="absolute inset-0 z-0">
        <Image
          src="/footer.jpg" // Replace with your image path
          alt="Bottom section background"
          fill
          className="object-cover"
          priority={false}
        />
      </div>
    </section>
  );
};
