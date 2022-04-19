import { BodyPartConstant, CARRY, MOVE, ATTACK, HEAL } from "game/constants";
import { Creep } from "game/prototypes";
import { attackerTick } from "./role.attacker";
import { haulerTick } from "./role.hauler";
import { healerTick } from "./role.healer";


export const roles:{[K:string]: {
    name: string
    run: (creep:Creep)=>void
    body: BodyPartConstant[]}
} = {
    hauler: {
        name: 'hauler',
        run: haulerTick,
        body: [MOVE, CARRY]
    },
    attacker: {
        name: 'attacker',
        run: attackerTick,
        body: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, MOVE]
    },
    healer: {
        name: 'healer',
        run: healerTick,
        body: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL]
    }
}
