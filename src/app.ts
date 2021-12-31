import express, { Express } from 'express';
import { Server } from 'http';


export class App {
  constructor() {
    this.app = express();
    this.port = 3000;
  }

  app: Express;
  port: number;
  server: Server;

  useRoutes() {}

  public async init() {
    this.useRoutes();
    this.server = this.app.listen(this.port);

    console.log(`Server is running on http://localhost:${this.port}`);
  }
}
