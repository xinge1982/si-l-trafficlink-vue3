declare global {
    namespace mapabcgl {

        class Map {
            constructor(options: any)

            addLayer(layer: any): void

            removeLayer(layer: any): void

            on(
                event: string,
                callback: (...args: any[]) => void
            ): void

            off(
                event: string,
                callback?: (...args: any[]) => void
            ): void

            remove(): void
        }

        class Marker {
            constructor(options?: any)
        }

        class Layer {
            constructor(options?: any)
        }

        class Popup{
            constructor(options?: any)
            setLngLat(options?: any): Popup
            setHTML(options?): Popup
            addTo(map:any): Popup
        }
    }
}

export {}