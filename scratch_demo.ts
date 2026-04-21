import { createDemoStore } from "./src/app/actions/demo";

async function run() {
  console.log("Applying Demo Mode...");
  const result = await createDemoStore();
  console.log("Result:", result);
}

run();
