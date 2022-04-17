
import { Flag } from "arena/prototypes";
import { ATTACK, CREEP_SPAWN_TIME, MOVE, RESOURCE_ENERGY, TOWER_ENERGY_COST } from "game/constants";
import { Creep, StructureContainer, StructureSpawn, StructureTower  } from "game/prototypes";
import { getObjectsByPrototype } from "game/utils";

let lhCreep: Creep | undefined;
let rhCreep: Creep | undefined;
export function loop(): void {
    const mySpawn = getObjectsByPrototype(StructureSpawn).find(c => c.my)
    const flags = getObjectsByPrototype(Flag)

    if (!mySpawn) {
        return
    }

    if(!lhCreep) {
        console.log('spawning lh')
        lhCreep = mySpawn.spawnCreep([MOVE]).object
        return
    } else {
        console.log('moving lh')
        lhCreep.moveTo(flags[0])
    }

    if(!rhCreep) {
        console.log('spawning rh')
        rhCreep = mySpawn.spawnCreep([MOVE]).object
        return
    } else {
        console.log('moving rh')
        rhCreep.moveTo(flags[1])
    }

}
