<template>
  <div class="changePass_box">
    <el-dialog
        v-model="dialog"
        :title="title"
        width="500px"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="cancel"
    >
      <p v-if="type !== 'edit'">
        注：您的密码为初始密码或已过有效期，请及时修改密码！
      </p>

      <el-form
          ref="changePassFormRef"
          :model="form"
          :rules="rules"
          size="small"
          label-width="140px"
      >
        <el-form-item
            :label="t('home.oldPassword')"
            prop="oldPass"
        >
          <el-input
              v-model="form.oldPass"
              type="password"
              autocomplete="current-password"
              show-password
              style="width: 300px"
          />
        </el-form-item>

        <el-form-item
            :label="t('home.newPassword')"
            prop="newPass"
        >
          <el-input
              v-model="form.newPass"
              type="password"
              autocomplete="new-password"
              show-password
              style="width: 300px"
          />
        </el-form-item>

        <el-form-item
            :label="t('home.confirmPassword')"
            prop="confirmPass"
        >
          <el-input
              v-model="form.confirmPass"
              type="password"
              autocomplete="new-password"
              show-password
              style="width: 300px"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button
              v-if="type === 'edit'"
              text
              @click="cancelModify"
          >
            {{ t('home.doNotModifyTemp') }}
          </el-button>

          <el-button
              :loading="loading"
              type="primary"
              @click="doSubmit"
          >
            {{ t('home.confirm') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import http from '@/api/http'
import { ElMessage } from 'element-plus'
import type {
  FormInstance,
  FormRules,
  FormItemRule,
} from 'element-plus'

import aes from '../tool/aes'
import rsa from '../tool/rsa'
import { useAppStore } from '@/store'

interface Props {
  isShowPopup: boolean
  type?: string
}

interface PasswordForm {
  oldPass: string
  newPass: string
  confirmPass: string
}

interface ValidatePasswordResponse {
  status: number
}

interface GeoItem {
  centerX: number
  centerY: number
  id: string | number
}

interface GeoResponse {
  resultObject: GeoItem[]
}

const props = withDefaults(defineProps<Props>(), {
  type: '',
})

const emit = defineEmits<{
  (event: 'closePassPopup'): void
}>()

const router = useRouter()
const { t } = useI18n()
const appStore = useAppStore()

const dialog = ref(props.isShowPopup)
const loading = ref(false)
const changePassFormRef = ref<FormInstance>()

const form = reactive<PasswordForm>({
  oldPass: '',
  newPass: '',
  confirmPass: '',
})

const title = computed(() => t('home.changePassword'))

function isNewLoginEnabled(): boolean {
  return Boolean(
      (window as unknown as Record<string, unknown>).newLogin,
  )
}

function encryptPassword(value: string): string {
  return isNewLoginEnabled()
      ? rsa.Encrypt(value)
      : aes.Encrypt(value)
}

function verifyPasswordRules(value: string): boolean {
  const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\s\S]{8,20}$/
  return reg.test(value)
}
const validateOldPassword: FormItemRule['validator'] = (
    _rule,
    value,
    callback,
) => {
  if (!value) {
    callback(new Error(t('home.oldPasswordWrong')))
    return
  }

  http.post<ValidatePasswordResponse>(
        `${window.APP_CONFIG.LOGO_SERVICE}mapabc-admin-system/api/v1/users/validPass/`,
        {
          password: encryptPassword(form.oldPass),
        },
        {
          headers: {
            Authorization: appStore.getToken(),
          },
        },
    )
    .then((response) => {
      if (
          response.status === 200 &&
          response.data.status === 200
      ) {
        callback()
      } else {
        callback(new Error(t('home.oldPasswordWrong')))
      }
    })
    .catch(() => {
      callback(new Error(t('home.oldPasswordWrong')))
    })
}

const validateNewPassword: FormItemRule['validator'] = (
    _rule,
    value,
    callback,
) => {
  const password = String(value ?? '')

  if (!password) {
    callback(new Error(t('home.enterNewPassword')))
    return
  }

  if (!verifyPasswordRules(password)) {
    callback(new Error(t('home.passwordCheckChar')))
    return
  }

  callback()
}

const validateConfirmPassword: FormItemRule['validator'] = (
    _rule,
    value,
    callback,
) => {
  if (form.newPass !== value) {
    callback(new Error(t('home.passwordsInconsistent')))
    return
  }

  callback()
}

const rules: FormRules<PasswordForm> = {
  oldPass: [
    {
      required: true,
      validator: validateOldPassword,
      trigger: 'blur',
    },
  ],
  newPass: [
    {
      required: true,
      validator: validateNewPassword,
      trigger: 'blur',
    },
  ],
  confirmPass: [
    {
      required: true,
      validator: validateConfirmPassword,
      trigger: 'blur',
    },
  ],
}

watch(
    () => props.isShowPopup,
    (value) => {
      dialog.value = value
    },
)

async function resetForm(): Promise<void> {
  emit('closePassPopup')

  changePassFormRef.value?.resetFields()

  form.oldPass = ''
  form.newPass = ''
  form.confirmPass = ''
}

async function cancel(): Promise<void> {
  await resetForm()
}

async function cancelModify(): Promise<void> {
  await resetForm()
}

async function doSubmit(): Promise<void> {
  if (!changePassFormRef.value) {
    return
  }

  try {
    const valid = await changePassFormRef.value.validate()

    if (!valid) {
      return
    }

    loading.value = true

    await http.post(
        `${window.APP_CONFIG.LOGO_SERVICE}mapabc-admin-system/api/v1/users/updatePass/`,
        {
          password: encryptPassword(form.confirmPass),
          oldPassword: encryptPassword(form.oldPass),
        },
        {
          headers: {
            Authorization: appStore.getToken(),
          },
        },
    )

    await resetForm()

    ElMessage.success(
        t('home.passwordChangedSuccessfully'),
    )

    window.setTimeout(() => {
      window.location.reload()
    }, 1500)
  } catch (error) {
    console.error('Update password failed:', error)
  } finally {
    loading.value = false
  }
}

async function getUserInfo(): Promise<void> {
  const token = appStore.getToken()

  if (!token) {
    await router.replace('/login')
    return
  }

  try {
    const response = await http.get<{
      resultObject: GeoResponse['resultObject']
    }>(
        `${window.APP_CONFIG.SERVICE_URL}constant/getGeo?`,
        {
          headers: {
            Authorization: token,
          },
        },
    )

    const defaultHomeRoute = window.APP_CONFIG.DefaultHometRoute

    await router.push(defaultHomeRoute || '/home')

    const item = response.data.resultObject?.[0]

    if (item) {
      sessionStorage.setItem(
          'center',
          JSON.stringify([item.centerX, item.centerY]),
      )
      sessionStorage.setItem('citycode', String(item.id))
    }
  } catch (error) {
    console.error('Get user information failed:', error)
  }
}

defineExpose({
  getUserInfo,
})
</script>

<style scoped>
.changePass_box :deep(.el-dialog__body p) {
  margin-top: -30px;
  padding-left: 10px;
  color: #f56c6c;
  line-height: 40px;
}
</style>
