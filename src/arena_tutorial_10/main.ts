import { BodyPart } from "arena/prototypes";
import { ATTACK, BodyPartConstant, BODYPART_COST, CARRY, ERR_NOT_IN_RANGE, MOVE, RESOURCE_ENERGY, WORK } from "game/constants";
import { Creep, Source, StructureSpawn } from "game/prototypes";
import { getObjectsByPrototype } from "game/utils";
import { moveCursor } from "readline";

const WORKER_BODY:BodyPartConstant[] = [WORK, CARRY, MOVE]
const WORKER_COST = BODYPART_COST[WORK] + BODYPART_COST[CARRY] + BODYPART_COST[MOVE]

const WARRIOR_BODY:BodyPartConstant[] = [MOVE, ATTACK, ATTACK, ATTACK]
const WARRIOR_COST = BODYPART_COST[MOVE] + BODYPART_COST[ATTACK] + BODYPART_COST[ATTACK] + BODYPART_COST[ATTACK]

export function loop(): void {

    getObjectsByPrototype(StructureSpawn).filter(s => s.my).forEach(spawn => {

        const workers = getObjectsByPrototype(Creep).filter(c => isWorker(c))

        if (workers.length < 2 && spawn.store[RESOURCE_ENERGY] >= WORKER_COST) {
            spawn.spawnCreep(WORKER_BODY)
            return
        }

        if (spawn.store[RESOURCE_ENERGY] >= WARRIOR_COST) {
            spawn.spawnCreep(WARRIOR_BODY)
            return
        }
    })

    getObjectsByPrototype(Creep).filter(c => c.my).filter(c => isWorker(c)).forEach(worker => {
        const sources = getObjectsByPrototype(Source)

        const closestSource =  worker.findClosestByPath(sources)
        if(!closestSource) {
            console.log('no source found, nothing to do')
            return
        }

        if((worker.store.getFreeCapacity() || 0) > 10) {
            if (worker.harvest(closestSource) == ERR_NOT_IN_RANGE) {
                worker.moveTo(closestSource)
            }
        } else {
            const spawns = getObjectsByPrototype(StructureSpawn)
            const closestSpawn = worker.findClosestByPath(spawns)
            if(!closestSpawn) {
                console.log('no spawn found, nothing to do')
                return
            }
            if (worker.transfer(closestSpawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                worker.moveTo(closestSpawn)
            }

        }
    })

    getObjectsByPrototype(Creep).filter(c => c.my).filter(c => isWarrior(c)).forEach(warrior => {

        const enemies = getObjectsByPrototype(Creep).filter(c => !c.my)

        const closestEnemy = warrior.findClosestByPath(enemies)

        if(!closestEnemy) {
            console.log('no enemies, nothing to do')
            warrior.moveTo({x:50, y:42})
            return
        }

        if(warrior.getRangeTo(closestEnemy) < 30) {
            if(warrior.attack(closestEnemy) == ERR_NOT_IN_RANGE) {
                warrior.moveTo(closestEnemy)
            }
        }


    })




}

function isWorker(creep: Creep):boolean {
    return creep.body.every(bodyPart => WORKER_BODY.includes(bodyPart.type))
}

function isWarrior(creep: Creep):boolean {
    return creep.body.every(bodyPart => WARRIOR_BODY.includes(bodyPart.type))
}
