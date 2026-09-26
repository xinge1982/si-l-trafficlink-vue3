export {}

declare global {
    interface LookAtConfig {
        lng: number
        lat: number
        heading: number
        pitch: number
        range: number
    }

    interface TilesetItem {
        path: string
        default: boolean
    }

    interface TilesetConfig {
        type: number
        data: TilesetItem[]
    }

    interface ImageryConfig {
        url: string
        maximumLevel: number
    }

    interface AppRuntimeConfig {
        MAP_URL: string
        MAP_STYLE: string
        MIN_MAP_STYLE: string
        MAP_CENTER: [number, number]
        MAP_ZOOM: number
        EVENT_MAP_ZOOM: number
        minZoom: number
        maxZoom: number
        mapabcglToken: string

        TRAFFIC_URL: string
        TRAFFIC_REFRESH_TIME: number

        threeMap: boolean
        lookAt: LookAtConfig
        tilesets: TilesetConfig
        modelPath: string
        skyBoxPath: string
        facilityPath: string
        imagerUrl: ImageryConfig[]

        LargeScreenDemo: number
        PlayVideoDemo: number
        PlayVideoDemoUrl: string
        isProtobuf: number
        newLogin: boolean

        WEBAPI_URL: string
        SERVICE_URL: string
        SERVICE_URL_v2: string
        SERVICE_URL_screen: string
        WEBSOCKET_URL: string
        CS_WEBSOCKET_URL?: string
        LOGO_SERVICE: string
        DEVICESERVICE_URL: string

        WEB_TITLE_V2: string
        WEB_TYPE: string
        DefaultHometRoute: string

        interVal: boolean
        intervalTime: number

        screenTitle: string
        leftTitle: string
        rightTitle: string

        nextRoute: string[]
        fireAlarm: boolean
        traffic: boolean
        moduleName: string
    }

    interface Window {
        APP_CONFIG: AppRuntimeConfig
    }
}
