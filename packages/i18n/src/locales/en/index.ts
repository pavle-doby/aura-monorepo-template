import { auth } from "./auth";
import { common } from "./common";
import { home } from "./home";
import { metadata } from "./metadata";
import { nav } from "./nav";
import { settings } from "./settings";

const en = {
  ...common,
  metadata,
  auth,
  home,
  nav,
  settings,
};

export default en;
