import {  ERR_NOT_IN_RANGE, RESOURCE_ENERGY } from "game/constants"
import { Creep, StructureContainer } from "game/prototypes"
import { getObjectsByPrototype } from "game/utils"
import { logger, getMySpawns } from "./util"



export function healerTick(healer: Creep) {

    const allFriends = getObjectsByPrototype(Creep).filter(c => c.my)
    const damagedFriends = allFriends.filter(c => c.hits < c.hitsMax)

    if(damagedFriends.length == 0) {
        healer.state = 'follow'
    } else {
        healer.state = 'heal'
    }

    states[healer.state](healer, allFriends, damagedFriends)
}

const states:{[K:string]: Function} = {
    follow: (healer: Creep, allFriends: Creep[], damagedFriends: Creep[]):void => {

        const closestAttacker = healer.findClosestByPath(allFriends.filter(c => c.role == 'attacker'))
        if(closestAttacker) {
          healer.moveTo(closestAttacker)
        }

    },

    heal: (healer: Creep, allFriends: Creep[], damagedFriends: Creep[]):void => {
        // TODO heal closest most wounded somehow
        const closestDamagedFriend = healer.findClosestByPath(damagedFriends)
        if(closestDamagedFriend) {
          if(healer.heal(closestDamagedFriend) == ERR_NOT_IN_RANGE) {
            healer.moveTo(closestDamagedFriend)
          }
        }
    }
}
