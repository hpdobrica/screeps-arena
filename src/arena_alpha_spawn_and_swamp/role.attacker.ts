import {  ERR_NOT_IN_RANGE, RESOURCE_ENERGY } from "game/constants"
import { Creep, StructureContainer, StructureSpawn } from "game/prototypes"
import { getObjectsByPrototype } from "game/utils"
import { logger, getMySpawns } from "./util"

let attackStarted = false

export function attackerTick(attacker: Creep) {

    attacker.state = determineState(attacker)

    states[attacker.state](attacker)
}

const determineState = (attacker: Creep):string => {
    // already started
    if(attackStarted) {
        return 'attack'
    }

    const attackers = getObjectsByPrototype(Creep).filter(c => c.my).filter(c => c.role == 'attacker')
    if (attackers.length >= 10) {
        logger.warn('attack starting due to attacker count')
        attackStarted = true
        return 'attack'
    }


    const haulers = getObjectsByPrototype(Creep).filter(c => c.my).filter(c => c.role == 'hauler')
    if(haulers.length == 0) {
        logger.warn('attack starting due to workers dead')
        attackStarted = true
        return 'attack'
    }


    const enemies = getObjectsByPrototype(Creep).filter(c => !c.my)
    const closestEnemy = attacker.findClosestByPath(enemies)

    if (closestEnemy && attacker.getRangeTo(closestEnemy) < 15) {
        attackStarted = true
        logger.warn('attack starting due to enemy proximity')
        return 'attack'
    }

    return 'wait'
}

const states:{[K:string]: Function} = {
    wait: (attacker: Creep):void => {
        const mySpawn = getMySpawns()[0]
        if(!mySpawn) {
            logger.err('no my spawn, gg?')
            return
        }
        // if(attacker.roleNumber % 2 == 0) {
        //     attacker.moveTo({x: mySpawn.x, y: mySpawn.y+10} )
        // } else {
        //     attacker.moveTo({x: mySpawn.x, y: mySpawn.y-10} )
        // }
        attacker.moveTo({x: mySpawn.x, y: mySpawn.y-5} )


    },
    attack: (attacker: Creep):void => {
        // TODO split into two streams for a free win chance / reduced free lose chance
        const enemies = getObjectsByPrototype(Creep).filter(c => !c.my)
        const closestEnemy = attacker.findClosestByPath(enemies)

        const enemySpawn = getObjectsByPrototype(StructureSpawn).find(s => !s.my)

        if (!enemySpawn) {
          logger.err('no enemy spawn, gg?')
          return
        }


        if (closestEnemy && attacker.getRangeTo(closestEnemy) < 20) {
          if (attacker.attack(closestEnemy) == ERR_NOT_IN_RANGE) {
            attacker.moveTo(closestEnemy)
          }
        } else {
          if (attacker.attack(enemySpawn) == ERR_NOT_IN_RANGE) {
            // TODO solve Rampart problem
            // TODO solve creep on same square as enemy spawn
            attacker.moveTo(enemySpawn)
          }
        }
    },

}
