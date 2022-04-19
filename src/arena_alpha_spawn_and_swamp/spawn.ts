import { ERR_BUSY, RESOURCE_ENERGY } from "game/constants"
import { StructureSpawn } from "game/prototypes"
import { getObjectsByPrototype } from "game/utils"
import { roles } from "./roles"
import { getCost, logger } from "./util"


const SPAWN_QUEUE = [
    {
        queue: [roles.hauler, roles.hauler, roles.hauler],
        active: true,
        counter: 0,
        repeat: 0,
    },
    {
        queue: [roles.attacker, roles.attacker, roles.healer],
        active: false,
        counter: 0,
        repeat: Infinity
    }
]

const roleCounter = Object.keys(roles).reduce<{[K:string]:number}>((acc, roleName) => {
    acc[roleName] = 0
    return acc
},{})


export function processTickForSpawn(spawn: StructureSpawn) {
    const currentQueue = SPAWN_QUEUE.find((q) => q.active)
    if(!currentQueue) {
        logger.err('no active queue', SPAWN_QUEUE)
        return
    }

    const currentSpawn = currentQueue.queue[currentQueue.counter]
    if (spawn.store[RESOURCE_ENERGY] >= getCost(currentSpawn.body)) {
        const creep = spawn.spawnCreep(currentSpawn.body)
        if(creep.error == ERR_BUSY) {
            return
        }
        if(creep.object) {
            roleCounter[currentSpawn.name]++
            creep.object.role = currentSpawn.name
            creep.object.roleNumber = roleCounter[currentSpawn.name]
        }
        logger.info('spawning creep', creep)
        currentQueue.counter++
        if(currentQueue.counter >= currentQueue.queue.length) {
            if(currentQueue.repeat == Infinity) {
                currentQueue.counter = 0
            }else if(currentQueue.repeat == 0) {
                const currentIndex = SPAWN_QUEUE.findIndex((q) => q.active)
                currentQueue.active = false
                if(!SPAWN_QUEUE[currentIndex+1]) {
                    logger.warn('end of queue', SPAWN_QUEUE)
                    return
                }
                SPAWN_QUEUE[currentIndex+1].active = true
            } else if(currentQueue.repeat > 0){
                currentQueue.repeat--
            } else {
                logger.err('currentQueue.repeat shouldnt be here')
                return
            }
        }
    }


}


