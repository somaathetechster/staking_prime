"use client";
export default function ActionButton({ label }) {
  return <button onClick={() => window.location.reload()}>{label}</button>;
}