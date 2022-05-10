require("dotenv").config();
import ExtendedClient from "./structures/ExtendedClient";

const Bot = new ExtendedClient();

Bot.start();
