
import { Flag } from "arena/prototypes";
import { ATTACK, BuildableStructure, CREEP_SPAWN_TIME, ERR_NOT_IN_RANGE, MOVE, RESOURCE_ENERGY, TOWER_ENERGY_COST } from "game/constants";
import { ConstructionSite, Creep, Source, StructureContainer, StructureSpawn, StructureTower  } from "game/prototypes";
import { createConstructionSite, getObjectsByPrototype } from "game/utils";

// 64, 53
let constructionSite:ConstructionSite<BuildableStructure> | undefined
export function loop(): void {
    const myCreep = getObjectsByPrototype(Creep).find(c => c.my)
    const container = getObjectsByPrototype(StructureContainer)[0]
    if(!myCreep || !container ){
        console.log('something missing')
        return
    }

    if (!constructionSite) {
        constructionSite = createConstructionSite({x:64, y:53}, StructureTower).object
    }

    if (!constructionSite) {
        console.log('no const site')
        return
    }

    if (myCreep.store[RESOURCE_ENERGY] > 0) {
        if (myCreep.build(constructionSite) == ERR_NOT_IN_RANGE) {
            myCreep.moveTo(constructionSite)
        }
    } else {
        if(container) {
            if(myCreep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                myCreep.moveTo(container)
            }
        }
    }



}
