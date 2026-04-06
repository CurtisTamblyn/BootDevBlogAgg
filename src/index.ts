import { Config, readConfig, setUser } from "./config";

function main() {
  setUser("kuraselache");
  const config = readConfig();
  console.log(config);
}

main();