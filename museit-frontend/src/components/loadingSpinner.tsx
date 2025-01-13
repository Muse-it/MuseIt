import { ProgressCircle } from "./ui/progress-circle";

export default function LoadingSpinner() {
  return (
    <div class="flex justify-center">
      <ProgressCircle value={30} class=" animate-spin max-w-10 max-h-10" />
    </div>
  );
}
