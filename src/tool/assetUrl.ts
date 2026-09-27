const assetModules = import.meta.glob('../assets/image/**/*', {
    eager: true,
    import: 'default',
}) as Record<string, string>

export function assetUrl(path: string): string {
    return assetModules[path] ?? ''
}
