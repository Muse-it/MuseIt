import { Button } from "./ui/button";
import { useColorMode } from "@kobalte/core/color-mode";
import { FiMoon, FiSun } from "solid-icons/fi";
import { createSignal } from "solid-js";
import {
  TextField,
  TextFieldErrorMessage,
  TextFieldInput,
} from "./ui/text-field";

export default function CredsEntry() {
  const [cid, setCid] = createSignal("");
  const [csecret, setCsecret] = createSignal("");

  function setCreds() {}

  function inputIsInvalid(): boolean {
    return false;
  }

  return (
    <form onSubmit={setCreds}>
      <div class="w-1/2">
        <TextField validationState={inputIsInvalid() ? "invalid" : "valid"}>
          <TextFieldInput
            type="text"
            class="outline-none rounded-lg border-2 bg-transparent text-2xl p-3 mb-4"
            placeholder="Client ID"
            value={cid()}
            onInput={(e) => setCid(e.currentTarget.value)}
          />
          <TextFieldErrorMessage class="mt-2 ml-2 mb-3">
            Client ID is empty
          </TextFieldErrorMessage>
        </TextField>
        <TextField validationState={inputIsInvalid() ? "invalid" : "valid"}>
          <TextFieldInput
            type="password"
            class="outline-none rounded-lg border-2 bg-transparent text-2xl p-3"
            placeholder="Client Secret"
            value={csecret()}
            onInput={(e) => setCsecret(e.currentTarget.value)}
          />
          <TextFieldErrorMessage class="mt-2 ml-2 mb-3">
            Client Secret is empty
          </TextFieldErrorMessage>
        </TextField>
        <div class="text-right">
          <Button class="mt-6">Submit</Button>
        </div>
      </div>
    </form>
  );
}
