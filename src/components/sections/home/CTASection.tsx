import Image from "next/image";

export const CTASection = () => {
  return (
    <section className="relative h-[70vh]">
      <div className="absolute inset-0 z-0">
        <Image
          src="/footer.jpg" // Replace with your image path
          alt="Bottom section background"
          fill
          className="object-cover"
          priority={false}
        />
      </div>
      <div className="absolute inset-0 bg-black/30 z-10" />{" "}
      {/* Optional dark overlay */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-white px-4 text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          Ready to Get Started?
        </h2>
        <p className="text-xl max-w-2xl mb-8">
          Join thousands of satisfied customers and experience the difference
          today.
        </p>
        <button className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors">
          Contact Us
        </button>
      </div>
    </section>
  );
};
