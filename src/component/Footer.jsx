import React from "react";
import { assets } from "../assets/assets";
import { delay, motion } from "motion/react";

const Footer = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mx-6 md:px-16 lg:px-24 xl:px-32 mt-60 text-sm text-gray-500 "
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-wrap justify-between items-start gap-8 pb-6 border-borderColor border-b"
      >
        <div>
          <motion.img
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            src={assets.logo}
            alt="logo"
            className=" h-8 md:h-9"
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-80 mt-3"
          >
            Premium car rental service with a wide selection of luxury and every
            vehicles for all your driving needs.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center gap-3 mt-6"
          >
            {/* Instagram */}
            <a href="#">
              <img
                src={assets.instagram_logo}
                alt="fb-logo"
                className="w-5 h-5"
              />
            </a>
            {/* Facebook */}
            <a href="#">
              <img src={assets.facebook_logo} alt="" className="w-5 h-5" />
            </a>
            {/* Twitter */}
            <a href="#">
              <img src={assets.twitter_logo} alt="" className="w-5 h-5" />
            </a>
            {/* LinkedIn */}
            {
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.98 3.5C3.88 3.5 3 4.38 3 5.48c0 1.1.88 1.98 1.98 1.98h.02c1.1 0 1.98-.88 1.98-1.98C6.98 4.38 6.1 3.5 4.98 3.5zM3 8.75h3.96V21H3V8.75zm6.25 0h3.8v1.68h.05c.53-.98 1.82-2.02 3.75-2.02 4.01 0 4.75 2.64 4.75 6.07V21H17v-5.63c0-1.34-.03-3.07-1.88-3.07-1.88 0-2.17 1.47-2.17 2.98V21H9.25V8.75z" />
              </svg>
            }
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-between w-1/2 gap-8"
        >
          <div>
            <h2 className="text-base font-medium text-gray-800 uppercase">
              Quick Links
            </h2>
            <ul className="mt-3 flex flex-col gap-1.5 ">
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">Browse Cars</a>
              </li>
              <li>
                <a href="#">List your car</a>
              </li>
              <li>
                <a href="#">About Us</a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-medium text-gray-800 uppercase">
              Resources
            </h2>
            <ul className="mt-3 flex flex-col gap-1.5 ">
              <li>
                <a href="#">Help center</a>
              </li>
              <li>
                <a href="#">Term of service</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Insurance</a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-medium text-gray-800 uppercase">
              Contact
            </h2>
            <ul className="mt-3 flex flex-col gap-1.5 ">
              <li>A02 Luxury Drive</li>
              <li>New York, USA 7807</li>
              <li>+1 234983805</li>
              <li>carrental@gmail.com</li>
            </ul>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-col md:flex-row gap-2 items-center justify-between py-5"
      >
        <p>
          © {new Date().getFullYear()}{" "}
          <a href="https://prebuiltui.com">CarRental</a>. All rights reserved.
        </p>
        <ul className="flex items-center gap-4">
          <li>
            <a href="#">Privacy</a>
          </li>
          <li>|</li>
          <li>
            <a href="#">Terms</a>
          </li>
          <li>|</li>
          <li>
            <a href="#">Cookies</a>
          </li>
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default Footer;
