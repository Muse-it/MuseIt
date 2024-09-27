import { Card } from "./ui/card";

export default function ErrorCard(props: { errorText: string }) {
  return (
    <Card class="m-2 p-2 dark:bg-red-950 bg-red-300">{props.errorText}</Card>
  );
}
