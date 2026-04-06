import type { Route } from "./+types/home";
import Home from "~/pages/home/Home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Paulo Ricardo Almeida — Software Engineer" },
    {
      name: "description",
      content:
        "Portfolio de Paulo Ricardo Almeida — Software Engineer especialista em React, TypeScript, React Native e Node.js.",
    },
  ];
}

export default function HomeRoute() {
  return <Home />;
}
