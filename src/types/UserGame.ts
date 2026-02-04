import type { LinuxSupport } from "./linuxSupport";

export interface UserGame {
  appid: number;
  name: string;
  storeUrl: string;
  image: string;
  linuxSupport: LinuxSupport;
  playtime: number
}
