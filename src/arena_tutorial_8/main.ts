
import { Flag } from "arena/prototypes";
import { ATTACK, CREEP_SPAWN_TIME, ERR_NOT_IN_RANGE, MOVE, RESOURCE_ENERGY, TOWER_ENERGY_COST } from "game/constants";
import { Creep, Source, StructureContainer, StructureSpawn, StructureTower  } from "game/prototypes";
import { getObjectsByPrototype } from "game/utils";


export function loop(): void {
    const mySpawn = getObjectsByPrototype(StructureSpawn).find(c => c.my)
    const myCreep = getObjectsByPrototype(Creep).find(c => c.my)
    const source = getObjectsByPrototype(Source)[0]

    if(!mySpawn || !myCreep || !source || !myCreep.store) {
        console.log('something is missing')
        console.log(mySpawn,myCreep,source)
        return
    }

    const harvestEvent = myCreep.harvest(source)
    if(harvestEvent == ERR_NOT_IN_RANGE) {
        myCreep.moveTo(source)
    }

    if ((myCreep.store.getFreeCapacity(RESOURCE_ENERGY) || 0) <= 2) {
        console.log('free capacity', myCreep.store.getFreeCapacity(RESOURCE_ENERGY))
        const transferEvent = myCreep.transfer(mySpawn, RESOURCE_ENERGY)
        if(transferEvent == ERR_NOT_IN_RANGE) {
            myCreep.moveTo(mySpawn)
        }
    }




}
