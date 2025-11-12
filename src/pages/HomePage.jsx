import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  BookOpen,
  Code,
  Shield,
  Cpu,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState("");

  // Image Slider State
  const [currentIndex, setCurrentIndex] = useState(0);

  // Slider Data
  const slides = [
    {
      image: "/src/assets/images/welcome.jpg",
      title: "Welcome to Learning Portal",
      description:
        "Your gateway to mastering technical skills with expert-led courses in IT, cybersecurity, and emerging technologies.",
      alt: "Welcome to Learning Portal",
    },
    {
      image: "/src/assets/images/latest-course.jpg",
      title: "Latest Courses Added",
      description:
        "Check out our newest courses on Blockchain Security, Advanced Penetration Testing, and Cloud Infrastructure Management.",
      alt: "Latest courses showcase",
    },
    {
      image: "/src/assets/images/team.jpg",
      title: "Join Our Tech Community",
      description:
        "Connect with fellow learners and industry experts in our growing community of tech enthusiasts and professionals.",
      alt: "Tech community collaboration",
    },
    {
      image: "/src/assets/images/discount.jpg",
      title: "Special Discount This Month",
      description:
        "Get 25% off on all Cybersecurity certification courses when you register before the end of the month.",
      alt: "Special discount promotion",
    },
  ];

  // Slider Functions
  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  // Auto-slide functionality
  useEffect(() => {
    const slideInterval = setInterval(() => {
      goToNext();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(slideInterval);
  }, [currentIndex]);

  // Original Functions
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubscribe = () => {
    console.log("Subscribing with email:", email);
    setEmail("");
    alert("Thank you for subscribing!");
  };

  // Navigation handlers
  const navigateToLogin = () => {
    navigate("/login");
  };

  const navigateToRegister = () => {
    navigate("/register");
  };

  const navigateToCourses = () => {
    // Navigate to the courses page
    navigate("/courses");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-xl font-bold">Learning Portal</span>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <a
                    href="/"
                    className="px-3 py-2 rounded-md text-sm font-medium bg-indigo-800"
                  >
                    Home
                  </a>
                  <a
                    href="#"
                    onClick={navigateToCourses}
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                  >
                    Courses
                  </a>
                  <a
                    href="#about"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                  >
                    About
                  </a>
                  <a
                    href="#contact"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                  >
                    Contact
                  </a>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <button
                  onClick={navigateToLogin}
                  className="px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 hover:bg-indigo-500 mr-2"
                >
                  Login
                </button>
                <button
                  onClick={navigateToRegister}
                  className="px-4 py-2 rounded-md text-sm font-medium bg-white text-indigo-900 hover:bg-gray-100"
                >
                  Register
                </button>
              </div>
            </div>
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-indigo-700 focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a
                href="/"
                className="block px-3 py-2 rounded-md text-base font-medium bg-indigo-800"
              >
                Home
              </a>
              <a
                href="#"
                onClick={navigateToCourses}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700"
              >
                Courses
              </a>
              <a
                href="#about"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700"
              >
                About
              </a>
              <a
                href="#contact"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700"
              >
                Contact
              </a>
            </div>
            <div className="pt-4 pb-3 border-t border-indigo-700">
              <div className="px-2 space-y-1">
                <button
                  onClick={navigateToLogin}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-indigo-600 hover:bg-indigo-500 mb-2"
                >
                  Login
                </button>
                <button
                  onClick={navigateToRegister}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-white text-indigo-900 hover:bg-gray-100"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Image Slider */}
      <div className="relative w-full h-96 overflow-hidden">
        {/* Left Arrow */}
        <div className="absolute top-1/2 left-4 -mt-6 z-10">
          <button
            onClick={goToPrevious}
            className="p-2 bg-black/30 hover:bg-black/50 text-white rounded-full"
          >
            <ChevronLeft size={24} />
          </button>
        </div>

        {/* Slide */}
        <div
          className="w-full h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          <div
            className="flex h-full"
            style={{ width: `${slides.length * 100}%` }}
          >
            {slides.map((slide, slideIndex) => (
              <div
                key={slideIndex}
                className="relative w-full h-full bg-gray-900"
                style={{ width: `${100 / slides.length}%` }}
              >
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-8 bg-black bg-opacity-40">
                  <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
                  <p className="text-xl max-w-2xl mb-6">{slide.description}</p>
                  <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors">
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow */}
        <div className="absolute top-1/2 right-4 -mt-6 z-10">
          <button
            onClick={goToNext}
            className="p-2 bg-black/30 hover:bg-black/50 text-white rounded-full"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Dots */}
        <div className="absolute bottom-4 left-0 right-0">
          <div className="flex items-center justify-center gap-2">
            {slides.map((_, slideIndex) => (
              <div
                key={slideIndex}
                onClick={() => goToSlide(slideIndex)}
                className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${
                  slideIndex === currentIndex ? "bg-white" : "bg-white/50"
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-900 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="md:flex md:items-center md:space-x-8">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Master Technical Skills with Our Online Learning Platform
              </h1>
              <p className="text-lg mb-8">
                Comprehensive courses in IT, cybersecurity, ethical hacking, and
                emerging technologies. Learn from industry experts and advance
                your career.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={navigateToCourses}
                  className="px-6 py-3 bg-white text-indigo-900 rounded-md font-medium hover:bg-gray-100"
                >
                  Browse Courses
                </button>
                <button
                  onClick={navigateToRegister}
                  className="px-6 py-3 bg-transparent border-2 border-white rounded-md font-medium hover:bg-indigo-800"
                >
                  Sign Up Free
                </button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-indigo-800 p-6 rounded-lg shadow-xl">
                <h3 className="text-xl font-semibold mb-4">Popular Courses</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Shield className="mr-3 text-indigo-300" size={20} />
                    <span>Cybersecurity Fundamentals</span>
                  </li>
                  <li className="flex items-center">
                    <Code className="mr-3 text-indigo-300" size={20} />
                    <span>Ethical Hacking & Penetration Testing</span>
                  </li>
                  <li className="flex items-center">
                    <Cpu className="mr-3 text-indigo-300" size={20} />
                    <span>Computer Hardware Essentials</span>
                  </li>
                  <li className="flex items-center">
                    <Zap className="mr-3 text-indigo-300" size={20} />
                    <span>Emerging Tech: AI & Machine Learning</span>
                  </li>
                </ul>
                <button
                  onClick={navigateToCourses}
                  className="mt-6 w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-md font-medium"
                >
                  View All Courses
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Learning Platform?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform provides comprehensive technical education with
              practical learning experiences designed by industry experts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="text-indigo-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Comprehensive Curriculum
              </h3>
              <p className="text-gray-600">
                Expertly crafted courses covering fundamental to advanced
                concepts in various technical domains.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <Code className="text-indigo-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Hands-on Practice</h3>
              <p className="text-gray-600">
                Interactive assignments and practical exercises to apply your
                knowledge in real-world scenarios.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="text-indigo-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Instructors</h3>
              <p className="text-gray-600">
                Learn from industry professionals with years of experience in
                their respective fields.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explore Course Categories
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Browse through our extensive library of courses across various
              technical domains.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category 1 */}
            <div className="bg-indigo-700 text-white p-6 rounded-lg shadow-md transition-transform hover:scale-105">
              <h3 className="text-xl font-semibold mb-2">
                Information Technology
              </h3>
              <p className="mb-4">
                Foundational IT skills, networking, system administration, and
                cloud computing.
              </p>
              <button
                onClick={navigateToCourses}
                className="inline-flex items-center text-indigo-200 hover:text-white"
              >
                Browse IT Courses <ChevronDown className="ml-1" size={16} />
              </button>
            </div>

            {/* Category 2 */}
            <div className="bg-indigo-800 text-white p-6 rounded-lg shadow-md transition-transform hover:scale-105">
              <h3 className="text-xl font-semibold mb-2">Cybersecurity</h3>
              <p className="mb-4">
                Network security, threat intelligence, incident response, and
                security frameworks.
              </p>
              <button
                onClick={navigateToCourses}
                className="inline-flex items-center text-indigo-200 hover:text-white"
              >
                Browse Security Courses{" "}
                <ChevronDown className="ml-1" size={16} />
              </button>
            </div>

            {/* Category 3 */}
            <div className="bg-indigo-900 text-white p-6 rounded-lg shadow-md transition-transform hover:scale-105">
              <h3 className="text-xl font-semibold mb-2">Ethical Hacking</h3>
              <p className="mb-4">
                Penetration testing, vulnerability assessment, and ethical
                hacking methodologies.
              </p>
              <button
                onClick={navigateToCourses}
                className="inline-flex items-center text-indigo-200 hover:text-white"
              >
                Browse Hacking Courses{" "}
                <ChevronDown className="ml-1" size={16} />
              </button>
            </div>

            {/* Category 4 */}
            <div className="bg-indigo-600 text-white p-6 rounded-lg shadow-md transition-transform hover:scale-105">
              <h3 className="text-xl font-semibold mb-2">Emerging Tech</h3>
              <p className="mb-4">
                AI, machine learning, blockchain, IoT, and other cutting-edge
                technologies.
              </p>
              <button
                onClick={navigateToCourses}
                className="inline-flex items-center text-indigo-200 hover:text-white"
              >
                Browse Tech Courses <ChevronDown className="ml-1" size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-3/5">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Start Your Learning Journey?
              </h2>
              <p className="text-lg mb-8 lg:mb-0">
                Create your account today and get access to premium technical
                courses, hands-on labs, and a supportive learning community.
              </p>
            </div>
            <div className="lg:w-2/5 lg:text-right">
              <button
                onClick={navigateToRegister}
                className="inline-block px-6 py-3 bg-white text-indigo-900 rounded-md font-medium hover:bg-gray-100 mr-4"
              >
                Sign Up Now
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("about")
                    .scrollIntoView({ behavior: "smooth" })
                }
                className="inline-block px-6 py-3 bg-transparent border-2 border-white rounded-md font-medium hover:bg-indigo-800"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-800 text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Learning Portal</h3>
              <p className="text-gray-400 mb-4">
                Providing quality online education in technical domains since
                2023.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">LinkedIn</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="text-gray-400 hover:text-white">
                    Home
                  </a>
                </li>
                <li>
                  <button
                    onClick={navigateToCourses}
                    className="text-gray-400 hover:text-white"
                  >
                    Courses
                  </button>
                </li>
                <li>
                  <a href="#about" className="text-gray-400 hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-400 hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <button
                    onClick={navigateToLogin}
                    className="text-gray-400 hover:text-white"
                  >
                    Login
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-gray-400">
                <li>123 kigali, Rwanda</li>
                <li>lps@gmail.com</li>
                <li>+250 781 042 421</li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Subscribe to Newsletter
              </h3>
              <p className="text-gray-400 mb-4">
                Stay updated with our latest courses and tech news.
              </p>
              <div className="flex flex-col sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Your email"
                  className="px-4 py-2 bg-gray-700 text-white rounded-md mb-2 sm:mb-0 sm:mr-2 focus:outline-none"
                />
                <button
                  onClick={handleSubscribe}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 focus:outline-none"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; 2025 Learning Portal System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
