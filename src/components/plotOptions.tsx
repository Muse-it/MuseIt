import { TMetadata } from "~/lib/metadata";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { DataSource } from "~/lib/dataSource";
import { createSignal } from "solid-js";
import {
  PlotConfig,
  PlotTypes,
  PlotWindows,
  getEnumValues,
  getFilename,
} from "~/lib/plotTypes";
import { navigateToPlot } from "~/lib/apiSignals";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function PlotOptions(props: {
  search: string;
  metadata: TMetadata;
  source: DataSource;
}) {
  const [plotConfig, setPlotConfig] = createSignal<PlotConfig>({
    type: PlotTypes.emotion,
    window: PlotWindows.percentage,
  });
  function showPlot() {
    console.log("showing", plotConfig());
    const filename = getFilename(plotConfig());
    console.log("filename: ", filename);
    navigateToPlot(props.source, getFilename(plotConfig()), props.search);
  }
  return (
    <Card class="m-2 p-4">
      <div class="flex align-middle">
        <span class="m-3">Visualise: </span>
        <div>
          <Select
            class="flex flex-col align-middle"
            value={plotConfig().type}
            onChange={(newVal) =>
              setPlotConfig({ ...plotConfig(), type: newVal })
            }
            options={getEnumValues(PlotTypes)}
            placeholder="Select a fruit…"
            itemComponent={(props) => (
              <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
            )}
          >
            <SelectTrigger class="w-[180px]">
              <SelectValue<string>>
                {(state) => state.selectedOption()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent />
          </Select>
        </div>
        <span class="m-3"> as </span>
        <div>
          <Select
            disabled={
              plotConfig().type === PlotTypes.hierarchical_topics ||
              plotConfig().type === PlotTypes.topics_visualization
            }
            class="flex flex-col align-middle"
            value={plotConfig().window}
            onChange={(newVal) =>
              setPlotConfig({ ...plotConfig(), window: newVal })
            }
            options={getEnumValues(PlotWindows)}
            itemComponent={(props) => (
              <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
            )}
          >
            <SelectTrigger class="w-[180px]">
              <SelectValue<string>>
                {(state) => state.selectedOption()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent />
          </Select>
        </div>
        <span class="m-3" />
        <Button onClick={showPlot}>Generate Plot</Button>
      </div>
    </Card>
  );
}
