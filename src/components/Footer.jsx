import React from 'react'
import { Heart, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  return (
  <footer className="footer-ocean mt-16 relative overflow-hidden fade-in">
      {/* Decorative ocean waves */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 ocean-wave"></div>
      </div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-6 float">
              <span className="text-3xl">🌊</span>
              <h3 className="text-2xl font-bold text-white">CherishIndia</h3>
            </div>
            <p className="text-blue-100 mb-4 leading-relaxed">
              <span className="font-semibold">Self Goodness : Better World</span>
            </p>
            <p className="text-blue-100/90 leading-relaxed">
              Dive into a world of sustainable e-commerce where every purchase creates waves of positive change. 
              Discover eco-friendly products that celebrate nature's beauty.
            </p>
            <div className="flex items-center space-x-2 mt-4 text-[hsl(var(--soft-pink))]">
              <Heart size={16} className="fill-current" />
              <span className="text-sm">Made with love for Mother Earth</span>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-blue-100 hover:text-[hsl(var(--soft-pink))] transition-colors duration-300 flex items-center group">
                  <span className="mr-2 group-hover:translate-x-1 transition-transform">→</span>
                  Home
                </a>
              </li>
              <li>
                <a href="/products" className="text-blue-100 hover:text-[hsl(var(--soft-pink))] transition-colors duration-300 flex items-center group">
                  <span className="mr-2 group-hover:translate-x-1 transition-transform">→</span>
                  Products
                </a>
              </li>
              <li>
                <a href="/cart" className="text-blue-100 hover:text-[hsl(var(--soft-pink))] transition-colors duration-300 flex items-center group">
                  <span className="mr-2 group-hover:translate-x-1 transition-transform">→</span>
                  Cart
                </a>
              </li>
              <li>
                <a href="/orders" className="text-blue-100 hover:text-[hsl(var(--soft-pink))] transition-colors duration-300 flex items-center group">
                  <span className="mr-2 group-hover:translate-x-1 transition-transform">→</span>
                  Orders
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Get In Touch</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-blue-100 group hover:text-[hsl(var(--soft-pink))] transition-colors">
                <Mail size={18} className="group-hover:scale-110 transition-transform" />
                <span>info@cherishindia.com</span>
              </div>
              <div className="flex items-center space-x-3 text-blue-100 group hover:text-[hsl(var(--soft-pink))] transition-colors">
                <Phone size={18} className="group-hover:scale-110 transition-transform" />
                <span>+91 12345 67890</span>
              </div>
              <div className="flex items-center space-x-3 text-blue-100 group hover:text-[hsl(var(--soft-pink))] transition-colors">
                <MapPin size={18} className="group-hover:scale-110 transition-transform" />
                <span>Mumbai, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-300/30 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-blue-100/80 text-center md:text-left">
              © 2025 CherishIndia. All rights reserved. | Making waves of change 🌊
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-blue-100/80 hover:text-[hsl(var(--soft-pink))] transition-colors">Privacy</a>
              <a href="#" className="text-blue-100/80 hover:text-[hsl(var(--soft-pink))] transition-colors">Terms</a>
              <a href="#" className="text-blue-100/80 hover:text-[hsl(var(--soft-pink))] transition-colors">Support</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer