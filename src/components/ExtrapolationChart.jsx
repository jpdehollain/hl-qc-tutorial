import { ExtrapolationPlot } from "./ScalingPlots";
import { usePoints } from "../lib/scalingStore";
import ExampleNote from "./ExampleNote";

// The extrapolation plot, drawn from the measurements made in the demo above it.
export default function ExtrapolationChart() {
  const points = usePoints();
  return (
    <>
      <ExampleNote points={points} />
      <ExtrapolationPlot points={points} />
    </>
  );
}
