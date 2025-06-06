import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-900 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Welcome to Mahusekwa Maternity Care
              </h1>
              <p className="text-lg mb-8">
                Your trusted partner for safe pregnancy, delivery, and postnatal
                care. Experience compassionate care with our modern facilities
                and expert team.
              </p>
              <Link
                to="/signup"
                className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Register Now
              </Link>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img
                src="https://images.pexels.com/photos/32386175/pexels-photo-32386175/free-photo-of-adorable-baby-smiling-in-diaper-on-soft-blanket.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Newborn baby"
                className="w-80 h-90 object-contain"
                style={{
                  borderRadius: "8px", // Adjust the radius as needed
                  border: "1px solid white", // White border color
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Our Maternity Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🤰"
              title="Prenatal Care"
              description="Regular checkups, ultrasound scans, and personalized care plans for healthy pregnancies"
            />
            <FeatureCard
              icon="👶"
              title="Safe Delivery"
              description="24/7 delivery services with modern facilities and experienced midwives"
            />
            <FeatureCard
              icon="❤"
              title="Postnatal Support"
              description="Newborn care guidance, breastfeeding support, and maternal health monitoring"
            />
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Get Started in 3 Simple Steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Register"
              description="Create your secure patient account online"
            />
            <StepCard
              number="2"
              title="Book Appointment"
              description="Schedule your prenatal checkups easily"
            />
            <StepCard
              number="3"
              title="Track Progress"
              description="Access your medical records anytime"
            />
          </div>
        </div>
      </div>

      {/* Emergency Section */}
      <div className="bg-red-50 py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-red-800">
            24/7 Emergency Services
          </h2>
          <p className="text-lg mb-8">
            For urgent maternity care, contact our emergency team immediately
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            <a
              href="tel:+263123456789"
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
              Call Emergency: +263 123 456 789
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Mahusekwa Hospital</h3>
            <p className="text-gray-400">
              Mashonaland East Province
              <br />
              Marondera District, Zimbabwe
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/about" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Patient Portal</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/login" className="hover:text-white">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-white">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-white-400 hover:text-white">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-white-400 hover:text-blue">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Reusable Feature Card Component
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

// Reusable Step Card Component
const StepCard = ({ number, title, description }) => (
  <div className="text-center p-6">
    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
      {number}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default HomePage;
