import Container from "typedi";
import { MollieClient, MOLLIECLIENT } from "../helpers/MollieClient";

export function di() {
  Container.set(MOLLIECLIENT, new MollieClient());
}
