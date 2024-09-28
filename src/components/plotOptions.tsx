import ErrorCard from "./errorCard";
import { Card } from "./ui/card";

export function PlotOptions() {
  return (
    <Card class="m-2 p-2">
      <ErrorCard errorText="test" />
      <div class="bg-slate-600">
        <div>Plots</div>
      </div>
    </Card>
  );
}
