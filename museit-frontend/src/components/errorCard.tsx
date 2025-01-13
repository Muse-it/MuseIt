import { Card } from "./ui/card";

export default function ErrorCard(props: { errorText: string }) {
  return <Card class="m-2 p-2 bg-error-foreground/40">{props.errorText}</Card>;
}
