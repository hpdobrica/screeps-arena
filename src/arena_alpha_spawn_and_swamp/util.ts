import { ATTACK, BodyPartConstant, BODYPART_COST, CARRY, HEAL, MOVE } from "game/constants"
import { Creep, StructureSpawn } from "game/prototypes"
import { getObjectsByPrototype } from "game/utils"

const logInfo = false
const logWarn = true
const logErr = true

export const logger = {
    info: (...data: any) => {
        if(logInfo) {
            console.log("INFO:", data)
        }
    },
    warn: (...data: any) => {
        if(logWarn) {
            console.log("WARNING:", data)
        }
    },
    err: (...data: any) => {
        if(logErr) {
            console.log("ERROR:", data)
        }
    }
}

export function hasBodyType(bodyType: BodyPartConstant[], creep: Creep): boolean {
    return creep.body.every(bodyPart => bodyType.includes(bodyPart.type))
}


export function getCost(body: BodyPartConstant[]) {
    return body.reduce<number>((acc: number, bodyPart: BodyPartConstant) => {
        return acc + BODYPART_COST[bodyPart]
    }, 0)
}

export function getMySpawns() {
    return getObjectsByPrototype(StructureSpawn).filter(s => s.my)
}
