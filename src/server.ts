import colors from 'colors';
import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import seedSuperUser from './app/DB';
let server: Server;

async function main() {
  // const IPaddress = process.env.IP?.toString()?? "localhost";
  const PORT = Number(config.port);
  try {
    await mongoose.connect(config.database_url as string);

    seedSuperUser();
    server = app.listen(
      PORT, 
      // IPaddress, 
      () => {
      console.log(
        // colors.green(
        //   `Socket Server is listening on: http://${IPaddress}:${config.port}`,
        // ),
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
  console.log(`😈 unahandledRejection is detected , shutting down ...`, err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log(`😈 uncaughtException is detected , shutting down ...`);
  process.exit(1);
});
