import { useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { grocerySeedData, electronicSeedData } from "../data/products";

export default function SeedButton() {
  const [status, setStatus] = useState<"idle" | "seeding" | "done" | "exists">("idle");

  async function seed() {
    setStatus("seeding");

    // Check if data already exists
    const grocSnap = await getDocs(collection(db, "groceries"));
    if (!grocSnap.empty) {
      setStatus("exists");
      return;
    }

    for (const item of grocerySeedData) {
      await addDoc(collection(db, "groceries"), item);
    }
    for (const item of electronicSeedData) {
      await addDoc(collection(db, "electronics"), item);
    }

    setStatus("done");
  }

  if (status === "done") return <p className="seed-msg">Firestore seeded successfully!</p>;
  if (status === "exists") return <p className="seed-msg">Data already exists in Firestore.</p>;

  return (
    <button className="seed-btn" onClick={seed} disabled={status === "seeding"}>
      {status === "seeding" ? "Seeding..." : "Seed Firestore with sample data"}
    </button>
  );
}
