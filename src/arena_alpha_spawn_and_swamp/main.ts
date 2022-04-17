import { BodyPart } from "arena/prototypes";
import { spawn } from "child_process";
import { ATTACK, BodyPartConstant, BODYPART_COST, CARRY, ERR_NOT_IN_RANGE, HEAL, MOVE, RESOURCE_ENERGY, WORK } from "game/constants";
import { Creep, Source, StructureContainer, StructureSpawn } from "game/prototypes";
import { getObjectsByPrototype } from "game/utils";
import { moveCursor } from "readline";
import { hasBodyType, HEALER_BODY, WARRIOR_BODY, WORKER_BODY } from "./common";
import { getMySpawns, processTickForSpawn } from "./spawn";
import { logger } from "./util";


let attackStarted = false

export function loop(): void {

  getMySpawns().forEach(spawn => processTickForSpawn(spawn))


  getObjectsByPrototype(Creep).filter(c => c.my).filter(c => hasBodyType(WORKER_BODY, c)).forEach(worker => {
    const containers = getObjectsByPrototype(StructureContainer).filter(c => c.store[RESOURCE_ENERGY] > 0)

    const closestContainer = worker.findClosestByPath(containers)
    if (!closestContainer) {
      logger.warn('no source found, nothing to do')
      return
    }

    if ((worker.store.getFreeCapacity() || 0) > 10) {
      if (worker.withdraw(closestContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        worker.moveTo(closestContainer)
      }
    } else {
      const spawns = getMySpawns()
      const closestSpawn = worker.findClosestByPath(spawns)
      if (!closestSpawn) {
        logger.warn('no spawn found, nothing to do')
        return
      }
      if (worker.transfer(closestSpawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        worker.moveTo(closestSpawn)
      }

    }
  })

  const warriors = getObjectsByPrototype(Creep).filter(c => c.my).filter(c => hasBodyType(WARRIOR_BODY,c))

  warriors.forEach(warrior => {

    const enemies = getObjectsByPrototype(Creep).filter(c => !c.my)
    const closestEnemy = warrior.findClosestByPath(enemies)


    if (warriors.length < 10 && !attackStarted) {
      const mySpawn = getObjectsByPrototype(StructureSpawn).find(s => s.my)
      if(!mySpawn) {
        return
      }
      warrior.moveTo({x: mySpawn.x, y: mySpawn.y+5} )

      if(getObjectsByPrototype(Creep).filter(c => c.my).filter(c => hasBodyType(WORKER_BODY, c)).length == 0) {
        logger.warn('attack starting due to workers dead')
        attackStarted = true
      }

      if (closestEnemy && warrior.getRangeTo(closestEnemy) < 15) {
        attackStarted = true
        logger.warn('attack starting due to enemy proximity')
        if (warrior.attack(closestEnemy) == ERR_NOT_IN_RANGE) {
          warrior.moveTo(closestEnemy)
        }
      }
      return
    }
    attackStarted = true



    const enemySpawn = getObjectsByPrototype(StructureSpawn).find(s => !s.my)

    if (!enemySpawn) {
      logger.err('no enemy spawn, gg?')
      return
    }


    if (closestEnemy && warrior.getRangeTo(closestEnemy) < 20) {
      if (warrior.attack(closestEnemy) == ERR_NOT_IN_RANGE) {
        warrior.moveTo(closestEnemy)
      }
    } else {
      if (warrior.attack(enemySpawn) == ERR_NOT_IN_RANGE) {
        // TODO solve Rampart problem
        warrior.moveTo(enemySpawn)
      }
    }

  })

  const healers = getObjectsByPrototype(Creep).filter(c => c.my).filter(c => hasBodyType(HEALER_BODY,c))

  healers.forEach(healer => {

    const friends = getObjectsByPrototype(Creep).filter(c => c.my)
    const damagedFriends = getObjectsByPrototype(Creep).filter(c => c.my).filter(c => c.hits < c.hitsMax)



    if(damagedFriends.length == 0) {
      // TODO heal closest most wounded somehow
      const closestWarrior = healer.findClosestByPath(friends.filter(c => hasBodyType(WARRIOR_BODY,c)))
      if(closestWarrior) {
        healer.moveTo(closestWarrior)
      }
    }else {
      const closestDamagedFriend = healer.findClosestByPath(damagedFriends)
      if(closestDamagedFriend) {
        if(healer.heal(closestDamagedFriend) == ERR_NOT_IN_RANGE) {
          healer.moveTo(closestDamagedFriend)
        }
      }
    }




  })


}
