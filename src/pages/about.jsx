import React from "react";

function About() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4 text-center text-gray-800">
        About Us
      </h1>
      <p className="text-lg text-gray-700 mb-4 text-justify">
        Welcome to <span className="font-semibold">Health & Fitness Store</span>! 
        Our mission is to provide top-quality fitness products that help you 
        achieve your health goals. From premium supplements to high-quality 
        workout equipment, we carefully select each product to ensure you 
        get the best.
      </p>
      <p className="text-lg text-gray-700 mb-4 text-justify">
        Our dedicated team is here to guide you and answer your questions, 
        making your fitness journey smooth and effective. Whether you’re a 
        beginner or a professional athlete, we have something to help you 
        succeed.
      </p>
      <p className="text-lg text-gray-700 text-justify">
        Join our community of health enthusiasts and start your journey 
        towards a healthier, stronger, and happier life today!
      </p>
    </div>
  );
}

export default About;
