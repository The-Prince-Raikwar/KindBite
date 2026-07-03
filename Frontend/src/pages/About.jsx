/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Clock,
  Utensils,
  Truck,
  Heart,
  ShieldCheck,
  Zap,
  Globe,
  Leaf,
  BarChart3,
  Smartphone,
  CheckCircle,
  Users,
  Gift,
} from "lucide-react";

const KindBiteAbout = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  return (
    <div className="bg-slate-50 text-slate-900 font-sans selection:bg-green-100">
      {/* --- HERO SECTION --- */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80"
          className="absolute inset-0 w-full h-full object-cover"
          alt="Premium Food"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-center">
          <motion.div {...fadeIn} className="max-w-2xl mx-auto">
            <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold tracking-widest uppercase mb-4 inline-block">
              Est. 2028
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
              Eat Well. <br />
              <span className="text-green-400">Do Good.</span>
            </h1>
            <p className="mt-6 text-xl text-slate-200 leading-relaxed">
              KindBite is the world's first food delivery ecosystem designed to
              end hunger while satisfying yours. Every meal you order triggers a
              chain of kindness.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- CORE FEATURES --- */}
      
      {/* --- IMPACT SECTION --- */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <Heart className="absolute -bottom-20 -right-20 text-white/5 w-96 h-96 rotate-12" />
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeIn}>
            <h2 className="text-4xl font-bold mb-8">
              Our Dual-Mission Technology
            </h2>
            <div className="space-y-6">
              <ImpactItem
                icon={<ShoppingBag />}
                title="Consumer Excellence"
                text="Access exclusive menus, real-time tracking, and personalized flavor profiles."
              />
              <ImpactItem
                icon={<Globe />}
                title="The Kindness Loop"
                text="Surplus food from our partners is instantly redirected to local NGOs via our live donation map."
              />
              <ImpactItem
                icon={<BarChart3 />}
                title="Transparency Tracker"
                text="See exactly where your donation goes with in-app proof of delivery to those in need."
              />
            </div>
          </motion.div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-green-500 to-emerald-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <img
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80"
              className="relative rounded-3xl shadow-2xl"
              alt="Donation impact"
            />
          </div>
        </div>
      </section>

      {/* --- FEATURE & BENEFITS SECTION (REPLACES OLD APP FEATURES GRID) --- */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold">Why Choose KindBite?</h2>
          <p className="text-slate-500 mt-4 text-lg max-w-2xl mx-auto">
            KindBite is more than just a food delivery app — it’s a complete
            platform designed to delight users, support restaurants, and feed
            communities sustainably.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureBenefit
            icon={<Smartphone className="text-green-600" />}
            title="Intuitive App UI"
          >
            Easy navigation, smart recommendations, and personalized meals.
          </FeatureBenefit>
          <FeatureBenefit
            icon={<Clock className="text-green-600" />}
            title="Scheduled Delivery"
          >
            Choose your preferred time and never miss a meal.
          </FeatureBenefit>
          <FeatureBenefit
            icon={<Utensils className="text-green-600" />}
            title="Dietary Filters"
          >
            Gluten-free, vegan, keto-friendly options for every taste.
          </FeatureBenefit>
          <FeatureBenefit
            icon={<Heart className="text-green-600" />}
            title="NGO Partnerships"
          >
            Contribute to local hunger relief automatically with every order.
          </FeatureBenefit>
          <FeatureBenefit
            icon={<Truck className="text-green-600" />}
            title="Live GPS Tracking"
          >
            Track your meal in real-time from kitchen to doorstep.
          </FeatureBenefit>
          <FeatureBenefit
            icon={<CheckCircle className="text-green-600" />}
            title="Quality Assurance"
          >
            Every dish goes through quality checks before delivery.
          </FeatureBenefit>
          <FeatureBenefit
            icon={<Users className="text-green-600" />}
            title="Group Ordering"
          >
            Order for your friends, office, or events effortlessly.
          </FeatureBenefit>
          <FeatureBenefit
            icon={<Gift className="text-green-600" />}
            title="Exclusive Offers"
          >
            Special discounts, loyalty rewards, and referral bonuses.
          </FeatureBenefit>
        </div>
      </section>

      {/* --- MISSION SECTION --- */}
      <section className="py-24 px-6 bg-green-50 relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[300px] h-[300px] bg-green-200 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-0 -right-32 w-[400px] h-[400px] bg-green-300 rounded-full blur-3xl opacity-30" />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div {...fadeIn}>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-green-800">
              Our Mission
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-8">
              At KindBite, our mission is simple:{" "}
              <strong>
                deliver happiness, fight hunger, and protect the planet
              </strong>
              . Every order contributes to a sustainable food ecosystem that
              benefits customers, restaurants, delivery partners, and
              communities alike.
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mt-10">
              <MissionCard icon={<Truck />} title="Fast & Reliable">
                Lightning-fast deliveries without compromising quality.
              </MissionCard>
              <MissionCard icon={<Gift />} title="Food Donations">
                Surplus food redirected to local NGOs in real time.
              </MissionCard>
              <MissionCard icon={<Leaf />} title="Sustainability">
                Eco-friendly packaging and optimized delivery routes.
              </MissionCard>
              <MissionCard icon={<Users />} title="Community Support">
                Empowering restaurants, drivers, and local neighborhoods.
              </MissionCard>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-green-600 rounded-[3rem] p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-6">
              Ready to take your first bite?
            </h2>
            <p className="text-green-100 mb-8 text-lg max-w-xl mx-auto">
              Join over 500,000+ kind humans who are changing the world one meal
              at a time.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-white text-green-700 px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform">
                Download for iOS
              </button>
              <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform">
                Download for Android
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

/* --- SUB-COMPONENTS --- */
const FeatureCard = ({ icon, title, desc, img }) => (
  <motion.div
    whileHover={{ y: -10 }}
    className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all"
  >
    <img src={img} className="h-48 w-full object-cover" alt={title} />
    <div className="p-8">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  </motion.div>
);

const ImpactItem = ({ icon, title, text }) => (
  <div className="flex gap-6">
    <div className="shrink-0 w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-green-400">
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <div>
      <h4 className="text-xl font-bold mb-1">{title}</h4>
      <p className="text-slate-400 leading-relaxed">{text}</p>
    </div>
  </div>
);

const FeatureBenefit = ({ icon, title, children }) => (
  <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl border border-transparent hover:border-green-200 transition-colors">
    <div className="text-green-600 mb-3">
      {React.cloneElement(icon, { size: 32 })}
    </div>
    <h4 className="font-semibold text-lg mb-2">{title}</h4>
    <p className="text-slate-600 text-sm">{children}</p>
  </div>
);

const MissionCard = ({ icon, title, children }) => (
  <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition text-center">
    <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 bg-green-100 rounded-full">
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <h4 className="font-semibold text-lg mb-2 text-green-800">{title}</h4>
    <p className="text-slate-600 text-sm">{children}</p>
  </div>
);

export default KindBiteAbout;
