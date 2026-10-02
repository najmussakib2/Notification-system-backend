// src/server.ts

import colors from 'colors';
import { Server } from 'http';
import config from './app/config';
import seedSuperUser from './app/DB';
import { serverApp } from './app';
import { connectDB } from './app/DB/connectDB';

let server: Server;

async function main() {
  const PORT = Number(config.port);
  try {
    await connectDB();
    seedSuperUser();

    server = serverApp.listen(PORT, () => {
      console.log(
        colors.green(
          `Socket Server is listening on: http://localhost:${config.port}`,
        ),
      );
    });
  } catch (err) {
    console.log(err);
  }
}

main();

process.on('unhandledRejection', (err) => {
  console.log(`😈 unhandledRejection detected, shutting down ...`, err);
  if (server) {
    server.close(() => process.exit(1));
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log(`😈 uncaughtException detected, shutting down ...`);
  process.exit(1);
});
