
import { Flag } from "arena/prototypes";
import { ATTACK, CREEP_SPAWN_TIME, MOVE, RESOURCE_ENERGY, TOWER_ENERGY_COST } from "game/constants";
import { Creep, StructureContainer, StructureSpawn, StructureTower } from "game/prototypes";
import { getObjectsByPrototype } from "game/utils";

// let attacker: Creep | undefined;
export function loop(): void {
    const myCreeps = getObjectsByPrototype(Creep).filter(c => c.my)
    const flags = getObjectsByPrototype(Flag)
    myCreeps.forEach(creep => {
        const closestFlag = creep.findClosestByPath(flags)
        if(closestFlag) {
            creep.moveTo(closestFlag)
        }

    })
}
