export default {
    /**
     * 安全拼接 URL
     * @param baseUrl 基础 URL
     * @param path 需要拼接的路径部分
     * @param params 查询参数对象（可选）
     * @returns 拼接后的完整 URL
     */
    safeJoinUrl(
        baseUrl,
        path,
        params)
    {
        // 确保基础 URL 以斜杠结尾
        if (!baseUrl.endsWith('/')) {
            baseUrl += '/'
        }

        // 确保路径部分以斜杠开头
        if (path && path.startsWith('/')) {
            path = path.slice(1) // 移除路径开头的斜杠
        }

        // 拼接基础 URL 和路径
        let fullUrl = `${baseUrl}${path}`

        // 如果有查询参数，则拼接查询字符串
        if (params && Object.keys(params).length > 0) {
            const queryString = new URLSearchParams(params).toString() // 使用 URLSearchParams 自动编码参数
            fullUrl += `?${queryString}`
        }

        return fullUrl
    },
}