function getRuntimeConfig(): AppRuntimeConfig {
    if (!window.APP_CONFIG) {
        throw new Error(
            'Runtime config is not loaded. ' +
            'Check public/config.js and index.html.',
        )
    }

    return window.APP_CONFIG
}

export const runtimeConfig = getRuntimeConfig()

export default runtimeConfig