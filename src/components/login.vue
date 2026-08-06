<template>
  <div class="logo_box">
    <div v-show="!key" class="user_box">
      <div class="logo_tip">
        {{ t('home.passwordLogin') }}
      </div>

      <div class="user">
        <el-input
            v-model="user"
            type="text"
            :placeholder="t('home.pleaseEnterUserName')"
            @keydown.enter="login"
        />
      </div>

      <div class="user password">
        <el-input
            v-model="password"
            type="password"
            :placeholder="t('home.pleaseEnterPassword')"
            show-password
            @keydown.enter="login"
            @paste.prevent
            @copy.prevent
            @cut.prevent
            @contextmenu.prevent
        />
      </div>

      <div v-show="newLogin" class="user captcha-row">
        <el-input
            v-model="code"
            type="text"
            placeholder="请输入验证码（点击图片刷新）"
            @keydown.enter="login"
        />

        <el-image
            class="captcha-image"
            :src="codeimgSrc"
            fit="fill"
            @click="getCode"
        />
      </div>

      <div class="user logo_btn" @click="login">
        {{ t('home.logIn') }}
      </div>

      <div class="web_title">
        {{ title }}
      </div>
    </div>

    <ChangePassword
        :is-show-popup="isShowPopup"
        @close-pass-popup="closePasswordPop"
    />
  </div>
</template>

<script setup lang="ts">
import {
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue'
import { useRoute, useRouter, type LocationQueryValue } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  ElLoading,
  ElMessage,
  type LoadingInstance,
} from 'element-plus'
import http from '@/api/http'
import qs from 'qs'

import ChangePassword from './changePassword.vue'
import { useAppStore } from '@/store'
import aes from '@/tool/aes'
import rsa from '@/tool/rsa'

declare global {
  interface Window {
    WEB_TITLE_V2?: string
    newLogin?: boolean
    LOGO_SERVICE?: string
    SERVICE_URL?: string
    moduleName?: string
    DefaultHometRoute?: string
    [key: string]: unknown
  }
}

interface CrossData {
  centerX?: LocationQueryValue | LocationQueryValue[]
  centerY?: LocationQueryValue | LocationQueryValue[]
  crossName?: LocationQueryValue | LocationQueryValue[]
  crossId?: LocationQueryValue | LocationQueryValue[]
}

interface LoginParams {
  username: string
  password: string
  code?: string
  suffix?: string
  uuid?: string
}

interface UserInfo {
  id?: string | number
  username?: string
  grade?: string
  resetPassword?: boolean
  remindTime?: string
}

interface LoginResponse {
  access_token: string
  userInfo?: UserInfo
}

interface MenuItem {
  component?: string
  params?: string
  children?: MenuItem[]
}

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const { t } = useI18n()

const user = ref('')
const password = ref('')
const uuid = ref('')
const code = ref('')
const codeimgSrc = ref('')
const key = ref(getQueryString(route.query.key))
const crossId = ref(getQueryString(route.query.crossId))
const title = ref(window.APP_CONFIG.WEB_TITLE_V2 ?? '')
const isShowPopup = ref(false)
const newLogin = ref(Boolean(window.APP_CONFIG.newLogin))
const loading = ref<LoadingInstance | null>(null)

const crossData = ref<CrossData>({
  centerX: route.query.centerX,
  centerY: route.query.centerY,
  crossName: route.query.crossName,
  crossId: route.query.crossId,
})

function getQueryString(
    value: LocationQueryValue | LocationQueryValue[] | undefined,
): string {
  if (Array.isArray(value)) {
    return value[0] ?? ''
  }

  return value ?? ''
}

function getLogoService(): string {
  return window.APP_CONFIG.LOGO_SERVICE
}

function getModuleName(): string {
  return window.APP_CONFIG.moduleName
}

function preventBrowserBack(): void {
  window.history.pushState(null, '', document.URL)
}

function openFullScreen(): void {
  closeLoading()

  loading.value = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(13, 20, 27, 0.6)',
  })
}

function closeLoading(): void {
  loading.value?.close()
  loading.value = null
}

async function loginByKey(): Promise<void> {
  appStore.setToken(`Bearer ${key.value}`)

  try {
    const hasPermission = await checkModulePermission()

    if (!hasPermission) {
      key.value = ''
      return
    }

    openFullScreen()

    if (crossId.value) {
      sessionStorage.setItem('crossData', JSON.stringify(crossData.value))
    }

    const response = await http.get<UserInfo>(
        `${getLogoService()}mapabc-admin-system/api/v1/users/getCurrentUserInfo`,
    )

    const userInfo = response.data

    sessionStorage.setItem('username', userInfo.username ?? '')
    sessionStorage.setItem('grade', userInfo.grade ?? '')
    sessionStorage.setItem('activeIndex', '0')

    if (crossId.value) {
      await handleCrossLoginRedirect()
    } else {
      await redirectToDefaultHome()
    }
  } catch (error) {
    console.error('Key login failed:', error)
    key.value = ''
  } finally {
    closeLoading()
  }
}

async function checkModulePermission(): Promise<boolean> {
  try {
    const response = await http.get<MenuItem[]>(
        `${getLogoService()}mapabc-admin-system/api/v1/menus/build/module`,
        {
          params: {
            moduleName: getModuleName(),
          },
        },
    )

    const menus = Array.isArray(response.data) ? response.data : []

    if (menus.length === 0) {
      ElMessage.warning({
        message: '您无登录权限。',
        duration: 2000,
      })

      return false
    }

    return true
  } catch (error) {
    console.error('Check module permission failed:', error)
    return false
  }
}

async function handleCrossLoginRedirect(): Promise<void> {
  const menu = getQueryString(route.query.menu)
  const time = getQueryString(route.query.time)
  const path = getQueryString(route.query.path)

  sessionStorage.setItem('menu', menu)
  sessionStorage.setItem('time', time)

  if (path) {
    const targetPath = path.startsWith('/') ? path : `/${path}`
    await router.push({ path: targetPath })
    return
  }

  await redirectToDefaultHome()
}

async function redirectToDefaultHome(): Promise<void> {
  const defaultHomeRoute = window.APP_CONFIG.DefaultHometRoute
  await router.push(defaultHomeRoute || '/home')
}

async function getModule(): Promise<void> {
  try {
    const response = await http.get<MenuItem[]>(
        `${getLogoService()}mapabc-admin-system/api/v1/menus/build/module`,
        {
          params: {
            moduleName: getModuleName(),
          },
        },
    )

    const firstMenu = response.data?.[0]?.children?.[0]

    if (!firstMenu) {
      ElMessage.warning('没有可访问的菜单。')
      return
    }

    const component = firstMenu.component ?? ''
    const params = firstMenu.params ?? ''
    const path = params ? `/${component}/${params}` : `/${component}`

    await router.push({ path })
  } catch (error) {
    console.error('Load module menu failed:', error)
    ElMessage.error('获取菜单失败。')
  }
}

function getCode(): void {
  uuid.value = aes.uuid(16, null)
  codeimgSrc.value =
      `${getLogoService()}` +
      `mapabc-admin-system/api/v1/auth/code/${uuid.value}` +
      `?timestamp=${Date.now()}`
}

async function getSysTitle(): Promise<void> {
  try {
    const serviceUrl = window.APP_CONFIG.SERVICE_URL
    const response = await http.get<{ data?: string }>(
        `${serviceUrl}cityV2/getSysTitle`,
    )

    title.value = response.data?.data ?? ''
  } catch (error) {
    console.error('Get system title failed:', error)
    title.value = ''
  }
}

function closePasswordPop(): void {
  isShowPopup.value = false
}

function validateLoginForm(): boolean {
  if (!user.value.trim()) {
    ElMessage.warning('请输入用户名。')
    return false
  }

  if (!password.value) {
    ElMessage.warning('请输入密码。')
    return false
  }

  if (newLogin.value && !code.value.trim()) {
    ElMessage.warning('请输入验证码。')
    return false
  }

  return true
}

function buildLoginParams(): LoginParams {
  if (newLogin.value) {
    appStore.setToken(
        'Basic bWFwYWJjLWFkbWluLXdlYjpmazcxK0pJRVNEcGNjMHZlU3ZJQnY5N2pnV28rRUlUV2c0MFBHTkh6dW54NmdiZmhKY0F3cFU5SGcvOWgzNFB5cmR3N2RtekVvck4vSlh4MC9pUktSNzVucW9DRFpVT3BWdC9uL2xLSEg1b2l3QXQxcEFkb0hhUVc0UmxSNHp4OGZVN3pzeCtTeVA4QzhsV093N1hYRHlRaE5xNk13SzNxQ3ZGNFRIajJWOUMvbmxQbGNlSmxIVVBaUWxrN0RrS2xkc1BESVJsUEMrSFkvWVM0M01QVEpnU1JkTnM2VVFibmJjZmRmUllhUnhjZStRYmRIVUkvaW9MTEZHNWV0dXlTcjVQQzl1YnN4WGlYT3ZGbHVja2N3cWpLZVNUMURXUW9sWWh1R05MZnFGL3VNSW5UYURLelFoRjNydjNHOGg3alZmc04zNXIvK2pyV04vc1Q3eUI3TlE9PQ==',
    )

    return {
      username: rsa.Encrypt(user.value),
      password: rsa.Encrypt(password.value),
      code: rsa.Encrypt(code.value),
      suffix: 'v2',
      uuid: uuid.value,
    }
  } else {
    appStore.setToken(
        'Basic bWFwYWJjLWFkbWluLXdlYjp5WklyZjBWUm5tQjdzVThpNldhQTB3PT0=',
    )
  }

  return {
    username: aes.Encrypt(user.value),
    password: aes.Encrypt(password.value),
  }
}

async function login(): Promise<void> {
  if (!validateLoginForm()) {
    return
  }

  const requestData = qs.stringify(buildLoginParams())

  try {
    const response = await http.post<LoginResponse>(
        `${getLogoService()}mapabc-admin-system/oauth/token`,
        requestData,
        {
          params: {
            grant_type: 'password',
            scope: 'app',
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
    )

    const result = response.data
    const userInfo = result.userInfo ?? {}
    const token = result.access_token

    appStore.setToken(`Bearer ${token}`)

    sessionStorage.setItem('username', userInfo.username ?? '')
    sessionStorage.setItem('activeIndex', '0')
    sessionStorage.setItem('userid', String(userInfo.id ?? ''))

    if (userInfo.remindTime) {
      ElMessage.warning({
        message: userInfo.remindTime,
        duration: 2000,
      })
    }

    if (!userInfo.resetPassword) {
      isShowPopup.value = true
      return
    }

    if (!appStore.token) {
      await router.replace('/login')
      return
    }

    const hasPermission = await checkModulePermission()

    if (hasPermission) {
      await redirectToDefaultHome()
    }
  } catch (error) {
    console.error('Login failed:', error)

    if (newLogin.value) {
      getCode()
    }

    password.value = ''
    code.value = ''
  }
}

onMounted(() => {
  if (newLogin.value) {
    getCode()
  }

  window.history.pushState(null, '', document.URL)
  window.addEventListener('popstate', preventBrowserBack)

  if (key.value) {
    void loginByKey()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('popstate', preventBrowserBack)
  closeLoading()
})

// Keep these functions available for future template or route use.
void getModule
void getSysTitle
</script>

<style>
.logo_box {
  width: 100%;
  height: 100%;
  min-height: 100vh;
  overflow: hidden;
  background-image: url('../assets/image/login/bg2.png');
  background-size: cover;
  background-position: center;
}

.user_box {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 500px;
  min-height: 390px;
  transform: translate(-50%, -50%);
  background-image: url('../assets/image/login/bor.png');
  background-size: 100% 100%;
}

.logo_tip {
  margin: 34px;
  color: #00c5e3;
  font-size: 20px;
}

.user {
  width: 420px;
  height: 40px;
  margin: 30px auto;
  border: 1px solid #00c5e3;
  color: #fff;
}

.user .el-input {
  width: 100%;
  height: 100%;
}

.user .el-input__wrapper {
  height: 40px;
  padding: 0 24px;
  border: none;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.user .el-input__wrapper:hover,
.user .el-input__wrapper.is-focus {
  box-shadow: none;
}

.user .el-input__inner {
  height: 40px;
  color: #fff;
  font-size: 14px;
  line-height: 40px;
}

.user .el-input__inner::placeholder {
  color: rgba(255, 255, 255, 0.65);
}

.user .el-input__password {
  color: #b7cbd1;
}

.captcha-row {
  display: flex;
  align-items: center;
  border: none;
}

.captcha-row .el-input {
  border: 1px solid #00c5e3;
}

.captcha-image {
  width: 200px;
  height: 42px;
  margin-left: 20px;
  cursor: pointer;
  user-select: none;
}

.logo_btn {
  margin-top: 50px;
  background: #00c5e3;
  color: #fff;
  font-size: 18px;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
  user-select: none;
}

.logo_btn:hover {
  background: #00b3ce;
}

.logo_btn:active {
  background: #009db5;
}

.home_logo {
  position: absolute;
  top: -130px;
  left: 169px;
  width: 162px;
  height: 43px;
  background-image: url('../assets/image/login/jx.png');
  background-size: 100% 100%;
}

.web_title {
  position: absolute;
  top: -60px;
  right: 0;
  left: 0;
  height: 30px;
  color: #fff;
  font-size: 24px;
  line-height: 30px;
  letter-spacing: 8px;
  text-align: center;
}

@media screen and (max-width: 600px) {
  .user_box {
    width: calc(100% - 30px);
  }

  .user {
    width: calc(100% - 60px);
  }

  .captcha-image {
    width: 140px;
  }
}
</style>
