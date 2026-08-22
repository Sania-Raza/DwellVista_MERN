import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-white mt-12">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-slate-200">DwellVista</h2>

            <p className="text-slate-400 text-sm mt-3 leading-6">
              Find your perfect place with ease. Explore a wide range of
              properties for rent and sale.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>

            <div className="flex flex-col gap-2 text-sm text-slate-400">
              <Link to="/" className="hover:text-white transition-colors">
                Home
              </Link>

              <Link to="/search" className="hover:text-white transition-colors">
                Properties
              </Link>

              <Link to="/about" className="hover:text-white transition-colors">
                About
              </Link>
            </div>
          </div>

          {/* Property */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Properties</h3>

            <div className="flex flex-col gap-2 text-sm text-slate-400">
              <Link
                to="/search?type=sale"
                className="hover:text-white transition-colors"
              >
                Properties for Sale
              </Link>

              <Link
                to="/search?type=rent"
                className="hover:text-white transition-colors"
              >
                Properties for Rent
              </Link>

              <Link
                to="/search?offer=true"
                className="hover:text-white transition-colors"
              >
                Recent Offers
              </Link>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Follow Us</h3>

            <div className="flex gap-4 text-slate-400">
              <a
                href="#"
                className="hover:text-white hover:scale-110 transition-all"
              >
                <FaFacebook size={20} />
              </a>

              <a
                href="#"
                className="hover:text-white hover:scale-110 transition-all"
              >
                <FaInstagram size={20} />
              </a>

              <a
                href="#"
                className="hover:text-white hover:scale-110 transition-all"
              >
                <FaTwitter size={20} />
              </a>

              <a
                href="#"
                className="hover:text-white hover:scale-110 transition-all"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-700 mt-8 pt-5 text-center">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} DwellVista. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
