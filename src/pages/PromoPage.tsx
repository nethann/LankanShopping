import { useParams } from "react-router-dom";

const PROMO_TITLES: Record<string, string> = {
  "save-more-every-day": "Save more every day",
  "ramadan-specials": "Ramadan Specials",
  "sinhala-tamil-new-year-delicacies": "Exploring Sinhala & Tamil New Year Delicacies",
  "register-with-rewards": "Register with rewards",
  "all-your-household-needs": "All your household needs",
  "weekly-export-picks": "Weekly export picks",
  "explore-lankan-brands": "Explore Lankan brands",
};

export default function PromoPage() {
  const { slug = "" } = useParams();
  const title = PROMO_TITLES[slug] ?? "Promotion";

  return (
    <section className="promo-detail-page">
      <h1 className="promo-detail-title">{title}</h1>
    </section>
  );
}
