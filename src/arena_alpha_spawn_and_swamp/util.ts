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
