import React from "react";

function About() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-green-600 text-white py-12">
        <h1 className="text-5xl font-extrabold text-center mb-2">
          About Health & Fitness Store
        </h1>
        <p className="text-center text-lg max-w-2xl mx-auto">
          Your one-stop destination for premium fitness products and expert guidance
        </p>
      </div>

      {/* Content Section */}
      <div className="container mx-auto p-6 space-y-8">
        <section className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Our Mission 🎯</h2>
          <p className="text-gray-700 text-justify leading-relaxed">
            At <span className="font-semibold">Health & Fitness Store</span>, our mission is to empower
            individuals to achieve their health and fitness goals. We provide
            top-quality products ranging from premium supplements to advanced
            workout equipment, carefully curated to help you succeed.
          </p>
        </section>

        <section className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Our Team 👥</h2>
          <p className="text-gray-700 text-justify leading-relaxed">
            Our dedicated team is committed to assisting you at every step of your
            fitness journey. Whether you are a beginner or a professional athlete,
            we provide guidance, support, and advice to ensure you reach your goals.
          </p>
        </section>

        <section className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Join Our Community 💪</h2>
          <p className="text-gray-700 text-justify leading-relaxed">
            Become a part of our community of health enthusiasts. Explore our
            products, follow our expert tips, and take the first step towards a
            healthier, stronger, and happier life.
          </p>
        </section>
      </div>
    </div>
  );
}

export default About;
