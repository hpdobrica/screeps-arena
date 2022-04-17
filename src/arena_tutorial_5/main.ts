import { ATTACK, MOVE, RESOURCE_ENERGY, TOWER_ENERGY_COST } from "game/constants";
import { Creep, StructureContainer, StructureSpawn, StructureTower } from "game/prototypes";
import { getObjectsByPrototype } from "game/utils";

// let attacker: Creep | undefined;
export function loop(): void {
    const tower = getObjectsByPrototype(StructureTower).find(i => i.my)
    if (!tower) {
        return
    }
    if(tower.store[RESOURCE_ENERGY] >= TOWER_ENERGY_COST) {
        const enemy = getObjectsByPrototype(Creep).find(i => !i.my)
        if(enemy) {
            tower.attack(enemy)
        }

    } else {
        const worker = getObjectsByPrototype(Creep).find(i => i.my)
        if (!worker) {
            return
        }
        if (worker.store[RESOURCE_ENERGY] > 0) {
            worker.transfer(tower, RESOURCE_ENERGY)
        } else {
            const container = getObjectsByPrototype(StructureContainer).find(i => i.exists)
            if(container) {
                worker.withdraw(container, RESOURCE_ENERGY)
            }
        }
    }

//   if (!attacker) {
//     const mySpawn = getObjectsByPrototype(StructureSpawn).find(i => i.my);
//     if (mySpawn) {
//       attacker = mySpawn.spawnCreep([MOVE, ATTACK]).object;
//     }
//   } else {
//     const enemySpawn = getObjectsByPrototype(StructureSpawn).find(i => !i.my);
//     if (enemySpawn) {
//       attacker.moveTo(enemySpawn);
//       attacker.attack(enemySpawn);
//     }
//   }
}
