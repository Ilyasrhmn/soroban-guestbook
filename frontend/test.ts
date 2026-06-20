import { createContractClient } from "./src/stellar.ts";

async function run() {
  try {
    const client = createContractClient("GC..."); // dummy address
    const tx = await client.get_messages();
    console.log("Messages:", tx.result);
  } catch (e) {
    console.error(e);
  }
}
run();
