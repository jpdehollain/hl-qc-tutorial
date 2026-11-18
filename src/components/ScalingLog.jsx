import { MeasuredPlotLog } from "./ScalingPlots";
import { usePoints } from "../lib/scalingStore";

// The extrapolation plot, drawn from the measurements made in the demo above it.
export default function ScalingLog() {
  const points = usePoints();
  return <MeasuredPlotLog points={points} />;
}
