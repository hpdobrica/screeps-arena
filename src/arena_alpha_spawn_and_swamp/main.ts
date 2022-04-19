import { ERR_NOT_IN_RANGE } from "game/constants";
import { Creep, StructureSpawn } from "game/prototypes";
import { getObjectsByPrototype } from "game/utils";
import { roles } from "./roles";
import { processTickForSpawn } from "./spawn";
import { logger, hasBodyType, getMySpawns } from "./util";


declare module "game/prototypes" {
  interface Creep {
    // initialPos: RoomPosition;
    role: string;
    state: string;
    roleNumber: number;
  }
}

let attackStarted = false

export function loop(): void {


  getMySpawns().forEach(spawn => processTickForSpawn(spawn))

  getObjectsByPrototype(Creep).filter(c => c.my).forEach(creep => {
    roles[creep.role].run(creep)
  })

}
