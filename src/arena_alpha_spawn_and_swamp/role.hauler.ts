import {  ERR_NOT_IN_RANGE, RESOURCE_ENERGY } from "game/constants"
import { Creep, StructureContainer } from "game/prototypes"
import { getObjectsByPrototype } from "game/utils"
import { logger, getMySpawns } from "./util"



export function haulerTick(hauler: Creep) {
    if((hauler.store.getFreeCapacity() || 0) > 0) {
        hauler.state = 'gather'
    } else {
        hauler.state = 'deposit'
    }
    states[hauler.state](hauler)
}

const states:{[K:string]: Function} = {
    gather: (hauler: Creep):void => {

        const containers = getObjectsByPrototype(StructureContainer).filter(c => c.store[RESOURCE_ENERGY] > 0)

        const closestContainer = hauler.findClosestByPath(containers)
        if (!closestContainer) {
          logger.warn('no source found, nothing to do')
          return
        }

        const withdrawRes = hauler.withdraw(closestContainer, RESOURCE_ENERGY)
        if (withdrawRes == ERR_NOT_IN_RANGE) {
            hauler.moveTo(closestContainer)
        }

    },

    deposit: (hauler: Creep):void => {
        const spawns = getMySpawns()
        const closestSpawn = hauler.findClosestByPath(spawns)
        if (!closestSpawn) {
          logger.warn('no spawn found, nothing to do')
          return
        }
        const transferRes = hauler.transfer(closestSpawn, RESOURCE_ENERGY)
        if (transferRes == ERR_NOT_IN_RANGE) {
            hauler.moveTo(closestSpawn)
        }
    }
}
