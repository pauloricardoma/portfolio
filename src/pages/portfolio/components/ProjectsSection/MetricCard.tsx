import type { IProjectMetric } from "~/interfaces/portfolio/IProject";
import { MetricItem, MetricValue, MetricLabel } from "./styles";

export default function MetricCard({ metric }: { metric: IProjectMetric }) {
  return (
    <MetricItem>
      <MetricValue>{metric.value}</MetricValue>
      <MetricLabel>{metric.label}</MetricLabel>
    </MetricItem>
  );
}
