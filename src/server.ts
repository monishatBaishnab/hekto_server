import { Server } from "http";
import app from "./app";
import { local_config } from "./app/config";

let server: Server;

const main = async () => {
  server = app.listen(local_config.port, () => {
    console.log("Hekto Server Running on port: ", local_config.port);
  });
};

main();
