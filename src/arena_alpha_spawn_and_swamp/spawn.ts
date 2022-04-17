import { ERR_BUSY, RESOURCE_ENERGY } from "game/constants"
import { StructureSpawn } from "game/prototypes"
import { getObjectsByPrototype } from "game/utils"
import { getCost, HEALER_BODY, WARRIOR_BODY, WORKER_BODY } from "./common"
import { logger } from "./util"


const SPAWN_QUEUE = [
    {
        queue: [WORKER_BODY, WORKER_BODY],
        active: true,
        counter: 0,
        repeat: 0,
    },
    {
        queue: [WARRIOR_BODY, WARRIOR_BODY, HEALER_BODY],
        active: false,
        counter: 0,
        repeat: Infinity
    }
]


export function processTickForSpawn(spawn: StructureSpawn) {
    const currentQueue = SPAWN_QUEUE.find((q) => q.active)
    if(!currentQueue) {
        logger.err('no active queue', SPAWN_QUEUE)
        return
    }

    const spawnBody = currentQueue.queue[currentQueue.counter]
    if (spawn.store[RESOURCE_ENERGY] >= getCost(spawnBody)) {
        const creep = spawn.spawnCreep(spawnBody)
        if(creep.error == ERR_BUSY) {
            return
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

export function getMySpawns() {
    return getObjectsByPrototype(StructureSpawn).filter(s => s.my)
}
