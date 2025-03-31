export const OfferingsSection = () => {
  return (
    <section className="bg-white min-h-screen w-full py-20 snap-start">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">
          What We Offer
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-blue-100 p-6 mb-6">
              {/* Icon can go here */}
              <svg
                className="w-10 h-10 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Quality Products</h3>
            <p className="text-gray-600">
              We offer the highest quality products sourced from trusted
              suppliers around the world.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-green-100 p-6 mb-6">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Best Prices</h3>
            <p className="text-gray-600">
              Competitive pricing without compromising on quality or service.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-purple-100 p-6 mb-6">
              <svg
                className="w-10 h-10 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">24/7 Support</h3>
            <p className="text-gray-600">
              Our dedicated support team is available around the clock to assist
              you.
            </p>
          </div>
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-8">
            Why Choose Us?
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 mb-10">
            With over 10 years of experience, we've become the industry leader
            in providing exceptional products and services to our customers
            worldwide.
          </p>
          <button className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
            Learn More About Us
          </button>
        </div>
      </div>
    </section>
  );
};
