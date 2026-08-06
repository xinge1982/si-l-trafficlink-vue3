declare global {
    class MapABCCrossing {
        constructor(map:any, gl: any, options: any)

        on(
            event: string,
            callback: (...args: any[]) => void
        ): void

        off(
            event: string,
            callback?: (...args: any[]) => void
        ): void
    }
}

export {}