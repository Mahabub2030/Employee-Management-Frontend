import { motion } from "framer-motion";
import {
  ArrowRight,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  Twitter,
} from "lucide-react";
import { Link } from "react-router";

// import Logo from "../../assets/images/logo.png";

const footerLinks = {
  product: [
    { label: "About Us", href: "/about" },
    { label: "Features", href: "/feature" },
    { label: "Pricing", href: "/pricing" },
    { label: "Merchant API", href: "#" },
  ],
  support: [
    { label: "Help Center", href: "/faq" },
    { label: "Contact Us", href: "/contact" },
    { label: "Security", href: "#" },
    { label: "System Status", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "Compliance", href: "#" },
  ],
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-card/30 border-t pt-16 pb-8 overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute bottom-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute bottom-[-10%] left-[-5%] w-72 h-72 bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="w-11/12 md:w-11/12 lg:w-11/12 xl:container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand & Description Column */}
          <div className="lg:col-span-4 space-y-6">
            <Link
              to="/"
              className="flex items-center gap-1.5 sm:gap-2 transition-transform hover:scale-105 shrink-0"
            >
              {/* <Logo className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10" /> */}
              {/* <img
                src={Logo}
                alt="wallet Logo"
                className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10"
              /> */}
              <p>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.0964 20.3536L17.6262 22.4473L17.046 27.6527L8.94876 36.8282C4.2486 33.8023 0.898178 28.8615 0 23.108L13.0964 20.3536Z"
                    fill="#15E3FF"
                  ></path>
                  <path
                    d="M25.183 25.94L31.2414 36.3789C27.992 38.6605 24.0331 40 19.7612 40C18.3744 40 17.0206 39.8587 15.7133 39.59L17.046 27.6527L20.4765 23.7656L25.183 25.94Z"
                    fill="#348DFC"
                  ></path>
                  <path
                    d="M39.1022 14.881C39.5332 16.5143 39.763 18.2294 39.763 19.9982C39.763 24.1145 38.5192 27.9403 36.3874 31.1207L25.184 25.9405L22.5551 21.4123L25.8574 17.6692L39.1022 14.881Z"
                    fill="#FD4873"
                  ></path>
                  <path
                    d="M17.046 27.6524L17.0458 27.6527L17.1686 26.552L17.046 27.6524Z"
                    fill="#FFC700"
                  ></path>
                  <path
                    d="M20.132 0C26.1505 0.109415 31.5194 2.877 35.1148 7.17842L25.8561 17.6694L20.9792 18.6959L18.519 14.4574L20.132 0Z"
                    fill="#FFC700"
                  ></path>
                  <path
                    d="M18.519 14.4574L17.9745 19.3269L13.0991 20.353L0.514709 14.5347C2.09964 8.94044 6.05794 4.3436 11.2327 1.9007L18.519 14.4574Z"
                    fill="#00E7B9"
                  ></path>
                </svg>
              </p>

              <div className="flex flex-col leading-none">
                <p className="text-lg sm:text-xl font-bold tracking-tight uppercase">
                  EMS-WEB<span className="text-primary">APP</span>
                </p>
                <span className="hidden sm:block text-[8px] lg:text-[10px] font-medium text-muted-foreground tracking-[0.1em] lg:tracking-[0.2em] uppercase">
                  EMS-WEB-APP
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              The next generation digital wallet for secure, instant, and
              borderless transactions. Empolwering your financial freedom
              anytime, anywhere.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                <Mail size={18} className="text-primary" />
                <span>support@wallet.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                <Phone size={18} className="text-primary" />
                <span>+880 123 456 789</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Product Links */}
            <div className="space-y-5">
              <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">
                Product
              </h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-primary transition-all hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div className="space-y-5">
              <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">
                Support
              </h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-primary transition-all hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div className="space-y-5">
              <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">
                Legal
              </h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-primary transition-all hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">
              Stay Updated
            </h4>
            <p className="text-sm text-muted-foreground">
              Subscribe to get the latest news and updates.
            </p>
            <div className="relative group">
              <input
                type="email"
                placeholder="Enter email"
                className="w-full bg-background border border-border rounded-lg py-3 px-4 outline-none focus:border-primary/50 transition-all pr-12"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-primary-foreground rounded-lg hover:scale-105 active:scale-95 transition-all">
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Social Media */}
            <div className="flex items-center gap-4 pt-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <motion.a
                  key={i}
                  whileHover={{ y: -5 }}
                  className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer border border-primary/5"
                >
                  <Icon
                    size={18}
                    fill="currentColor"
                    className={
                      Icon === Linkedin || Icon === Twitter
                        ? ""
                        : "fill-current"
                    }
                  />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear}{" "}
            <span className="font-bold text-foreground">Digital Wallet</span>.
            All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
              alt="PayPal"
              className="h-4 grayscale opacity-50 hover:opacity-100 transition-opacity"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
              alt="Mastercard"
              className="h-4 grayscale opacity-50 hover:opacity-100 transition-opacity"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
              alt="Visa"
              className="h-4 grayscale opacity-50 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
