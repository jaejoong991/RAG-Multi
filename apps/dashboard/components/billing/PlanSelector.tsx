"use client";

import { CheckCircle2 } from "lucide-react";
import axios from "axios";

const plans = [
  {
    name: "Developer",
    price: "$0",
    desc: "Perfect for prototyping",
    priceId: null,
    features: ["1,000 Queries / mo", "500 MB Storage", "Standard LLM Models"],
    cta: "Current Plan",
  },
  {
    name: "Professional",
    price: "$249",
    desc: "For growing startups",
    priceId: "price_professional_id",
    features: ["25,000 Queries / mo", "50 GB Vector Storage", "Priority Support"],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    name: "Business",
    price: "$899",
    desc: "Complex high-load systems",
    priceId: "price_business_id",
    features: ["Unlimited Queries", "1 TB Storage", "Custom Fine-tuning"],
    cta: "Contact Sales",
  },
];

export function PlanSelector() {
  const handleUpgrade = async (priceId: string | null) => {
    if (!priceId) return;

    try {
      const response = await axios.post("/api/v1/billing/checkout", { priceId });
      if (response.data.success) {
        window.location.href = response.data.data.url;
      }
    } catch (error) {
      console.error("Upgrade failed:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {plans.map((plan) => (
        <div 
          key={plan.name} 
          className={`glass-panel rounded-2xl p-8 flex flex-col relative transition-all ${
            plan.popular ? "border-primary/40 shadow-[0_0_40px_rgba(124,58,237,0.1)] scale-105 z-10" : "border-white/5"
          }`}
        >
          {plan.popular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 primary-gradient px-4 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest">
              Most Popular
            </div>
          )}
          
          <div className="mb-6">
            <h4 className="text-lg font-bold text-white mb-1">{plan.name}</h4>
            <p className="text-on-surface-variant text-sm">{plan.desc}</p>
          </div>

          <div className="mb-6 flex items-baseline gap-1">
            <span className="text-4xl font-bold text-white">{plan.price}</span>
            <span className="text-on-surface-variant text-sm">/mo</span>
          </div>

          <ul className="space-y-4 mb-8 flex-1">
            {plan.features.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-on-surface-variant">
                <CheckCircle2 size={16} className="text-success" />
                {f}
              </li>
            ))}
          </ul>

          <button 
            onClick={() => handleUpgrade(plan.priceId)}
            disabled={!plan.priceId}
            className={`w-full py-3 rounded-xl font-bold transition-all ${
              plan.popular 
                ? "primary-gradient text-white shadow-lg shadow-primary/20 hover:opacity-90" 
                : "border border-white/10 text-white hover:bg-white/5"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {plan.cta}
          </button>
        </div>
      ))}
    </div>
  );
}
