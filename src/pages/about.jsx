import React from "react";

function About() {
  return (
    // Replaced Tailwind classes with Bootstrap utilities for full-screen background
    <div className="bg-light min-vh-100">
      
      {/* Hero Section */}
      {/* bg-green-600 text-white py-12 -> bg-success text-white py-5 */}
      <div className="bg-success text-white py-5">
        <div className="container">
          {/* text-5xl font-extrabold text-center mb-2 -> display-4 text-center fw-bold mb-2 */}
          <h1 className="display-4 text-center fw-bold mb-2">
            About Health & Fitness Store
          </h1>
          {/* text-center text-lg max-w-2xl mx-auto -> text-center lead mx-auto" style={{maxWidth: '700px'}} */}
          <p className="text-center lead mx-auto" style={{maxWidth: '700px'}}>
            Your one-stop destination for **premium fitness products** and **expert guidance**
          </p>
        </div>
      </div>

      {/* Content Section */}
      {/* container mx-auto p-6 space-y-8 -> container py-5 */}
      <div className="container py-5">
        
        {/* Sections are now in a Bootstrap Grid for better spacing and layout */}
        <div className="row g-4">
            
            {/* Our Mission Card */}
            <div className="col-lg-4 col-md-6">
                {/* bg-white shadow-lg rounded-lg p-6 -> card h-100 shadow-sm */}
                <section className="card h-100 shadow-sm border-0">
                    <div className="card-body p-4">
                        {/* text-3xl font-bold mb-4 text-gray-800 -> card-title fs-3 fw-bold text-dark mb-3 */}
                        <h2 className="card-title fs-3 fw-bold text-dark mb-3">Our Mission 🎯</h2>
                        {/* text-gray-700 text-justify leading-relaxed -> card-text text-muted text-justify */}
                        <p className="card-text text-muted text-justify">
                            At <span className="fw-semibold">Health & Fitness Store</span>, our mission is to **empower individuals** to achieve their health and fitness goals. We provide top-quality products ranging from premium supplements to advanced workout equipment, carefully curated to help you succeed.
                        </p>
                    </div>
                </section>
            </div>
            
            {/* Our Team Card */}
            <div className="col-lg-4 col-md-6">
                <section className="card h-100 shadow-sm border-0">
                    <div className="card-body p-4">
                        <h2 className="card-title fs-3 fw-bold text-dark mb-3">Our Team 👥</h2>
                        <p className="card-text text-muted text-justify">
                            Our dedicated team, composed of **certified trainers and nutrition experts**, is committed to assisting you at every step of your fitness journey. Whether you are a beginner or a professional athlete, we provide guidance, support, and advice to ensure you reach your goals.
                        </p>
                    </div>
                </section>
            </div>
            
            {/* Join Our Community Card */}
            <div className="col-lg-4 col-md-12">
                <section className="card h-100 shadow-sm border-0 bg-info bg-opacity-10">
                    <div className="card-body p-4">
                        <h2 className="card-title fs-3 fw-bold text-dark mb-3">Join Our Community 💪</h2>
                        <p className="card-text text-muted text-justify">
                            Become a part of our **thriving community** of health enthusiasts. Explore our products, follow our expert tips, and take the first step towards a healthier, stronger, and happier life. We offer exclusive content and member perks!
                        </p>
                        <div className="mt-3 text-center">
                            <a href="#" className="btn btn-success fw-bold">Start Your Journey Today &raquo;</a>
                        </div>
                    </div>
                </section>
            </div>
        </div>
      </div>
    </div>
  );
}

export default About;