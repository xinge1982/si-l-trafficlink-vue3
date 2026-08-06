import { defineStore } from 'pinia'

export interface StoreState {
    isMinMapShow: boolean
    sideVisibility: boolean
    token: string
}

function getInitialToken(): string {
    if (typeof window === 'undefined') {
        return ''
    }

    return sessionStorage.getItem('token') ?? ''
}

export const useAppStore = defineStore('store', {
    state: (): StoreState => ({
        isMinMapShow: false,
        sideVisibility: true,
        token: getInitialToken(),
    }),

    getters: {
        /**
         * Whether the user currently has a token.
         */
        hasToken: (state): boolean => Boolean(state.token),
    },

    actions: {
        setMinMapShow(): void {
            this.isMinMapShow = true
        },

        setMinMapHide(): void {
            this.isMinMapShow = false
        },

        setToken(token: string): void {
            this.token = token

            if (typeof window !== 'undefined') {
                sessionStorage.setItem('token', token)
            }
        },

        getToken(): string {
            if (this.token) {
                return this.token
            }

            if (typeof window === 'undefined') {
                return ''
            }

            const token = sessionStorage.getItem('token') ?? ''
            this.token = token
            return token
        },

        deleteToken(): void {
            this.token = ''

            if (typeof window !== 'undefined') {
                sessionStorage.removeItem('token')
            }
        },

        toggleSideVisibility(): void {
            this.sideVisibility = !this.sideVisibility
        },
    },
})

export default useAppStore