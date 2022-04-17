import { ATTACK, BodyPartConstant, BODYPART_COST, CARRY, HEAL, MOVE } from "game/constants"
import { Creep } from "game/prototypes"

export const WORKER_BODY: BodyPartConstant[] = [MOVE, MOVE, CARRY]
export const WARRIOR_BODY: BodyPartConstant[] = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK]
export const HEALER_BODY: BodyPartConstant[] = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL]


export function hasBodyType(bodyType: BodyPartConstant[], creep: Creep): boolean {
    return creep.body.every(bodyPart => bodyType.includes(bodyPart.type))
}


export function getCost(body: BodyPartConstant[]) {
    return body.reduce<number>((acc: number, bodyPart: BodyPartConstant) => {
        return acc + BODYPART_COST[bodyPart]
    }, 0)
}

