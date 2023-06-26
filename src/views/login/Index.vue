<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="6" sm="9">
        <v-app-bar-title class="mg-tittle">
          <v-avatar color="#cb7760">
            <v-icon icon="mdi-vector-bezier" size="x-large" />
          </v-avatar>
          <span class="ml-4">VectorLink</span>
        </v-app-bar-title>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="6" sm="9">
        <v-card>
          <v-container class="fill-height">
            <v-row>
              <v-col cols="6">QRCODE</v-col>
              <v-divider vertical></v-divider>
              <v-col cols="6">
                <v-tabs v-model="tab" align-tabs="title" size="x-large">
                  <v-tab value="one">Password Login</v-tab>
                  <v-tab value="two">SMS Login</v-tab>
                  <v-tab value="three">Register</v-tab>
                </v-tabs>
                <v-window v-model="tab">
                  <v-window-item value="one">
                    <v-container>
                      <v-row>
                        <v-col>
                          <v-sheet class="mx-auto">
                            <v-form ref="passwdLoginFormRef" fast-fail @submit.prevent>
                              <v-text-field
                                v-model="passwdLoginForm.username"
                                label="USERNAME"
                                :rules="usernameRules"
                              ></v-text-field>
                              <v-text-field
                                v-model="passwdLoginForm.password"
                                label="PASSWORD"
                                :append-inner-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="passwordShow ? 'text' : 'password'"
                                :rules="passwordRules"
                                @click:append-inner="passwordShow = !passwordShow"
                              ></v-text-field>
                              <v-container class="ma-0 pa-0">
                                <v-row>
                                  <v-col cols="6">
                                    <v-text-field
                                      v-model="passwdLoginForm.code"
                                      label="VERIFICATION CODE"
                                      :rules="codeRules"
                                    ></v-text-field>
                                  </v-col>
                                  <v-col cols="6">
                                    <img :src="code.src" @click="refreshCode" style="cursor: pointer" />
                                  </v-col>
                                </v-row>
                              </v-container>
                              <v-btn type="submit" class="me-4" :loading="loginBtnLoading" @click="handlePasswordLogin">
                                Submit
                              </v-btn>
                              <v-btn @click="handlePasswdLoginFormReset">clear</v-btn>
                            </v-form>
                          </v-sheet>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-window-item>
                  <v-window-item value="two">
                    <v-container>
                      <v-row>
                        <v-col>
                          <v-sheet class="mx-auto">
                            <v-form fast-fail @submit.prevent>
                              <v-text-field
                                v-model="smsLoginForm.phone"
                                label="PHONE"
                                :rules="phoneRules"
                              ></v-text-field>
                              <v-text-field
                                v-model="smsLoginForm.code"
                                label="VERIFICATION CODE"
                                :rules="codeRules"
                              ></v-text-field>
                              <v-btn type="submit" class="me-4">Submit</v-btn>
                              <v-btn @click="handleSmsLoginFormReset">clear</v-btn>
                            </v-form>
                          </v-sheet>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-window-item>
                  <v-window-item value="three">
                    <v-container>
                      <v-row>
                        <v-col>
                          <v-sheet class="mx-auto">
                            <v-form ref="registerFormRef" fast-fail @submit.prevent>
                              <v-text-field
                                v-model="registerForm.username"
                                label="USERNAME"
                                :rules="usernameRules"
                              ></v-text-field>
                              <v-text-field
                                v-model="registerForm.password"
                                label="PASSWORD"
                                :rules="passwordRules"
                              ></v-text-field>
                              <v-btn type="submit" class="me-4" @click="handleRegisterFormSubmit">Submit</v-btn>
                              <v-btn @click="handleRegisterFormReset">clear</v-btn>
                            </v-form>
                          </v-sheet>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-window-item>
                </v-window>
                <v-container>
                  <v-row><v-divider></v-divider></v-row>
                  <v-row>
                    <v-col>
                      <p class="text-center">其他登录方式</p>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="1" class="text-center" offset="5">
                      <v-icon icon="mdi-wechat" size="x-large" color="green-darken-2"></v-icon>
                    </v-col>
                    <v-col cols="1" class="text-center">
                      <v-icon icon="mdi-sina-weibo" size="x-large" color="red-darken-2"></v-icon>
                    </v-col>
                  </v-row>
                </v-container>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-snackbar v-model="loginSnackbar">
    {{ errorMsg }}
    <template v-slot:actions>
      <v-btn color="pink" variant="text" @click="loginSnackbar = false"> Close </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/store/auth'
  import { encryption } from '@/utils/crypto'
  import { loginByPassword, registerUser } from '@/api/auth/account'

  const router = useRouter()
  const authStore = useAuthStore()
  const tab = ref(null)
  const passwdLoginFormRef = ref(null)
  const smsLoginFormRef = ref(null)
  const registerFormRef = ref(null)
  const loginBtnLoading = ref(false)
  const loginSnackbar = ref(false)
  const errorMsg = ref('')

  const passwdLoginForm = ref({
    username: '',
    password: '',
    code: '',
    randomStr: '',
  })
  const passwordShow = ref(false)

  const code = ref({
    src: 'api/code',
    value: '',
    len: 4,
    type: 'message',
  })

  const usernameRules = ref([
    (value: string) => {
      if (value?.length > 2) {
        return true
      }
      return 'Username must be at least 3 characters.'
    },
  ])

  const passwordRules = ref([
    (value: string) => {
      if (value?.length > 2) {
        return true
      }
      return 'Password must be at least 3 characters.'
    },
  ])

  const codeRules = ref([
    (value: string) => {
      if (value) {
        return true
      }
      return 'Code must not be empty.'
    },
  ])

  const smsLoginForm = ref({
    phone: '',
    code: '',
  })

  const phoneRules = ref([
    (value: string) => {
      if (value?.length > 3) {
        return true
      }
      return 'Username must be at least 3 characters.'
    },
  ])

  const registerForm = ref({
    username: '',
    password: '',
  })

  /** 密码登录 */
  async function handlePasswordLogin() {
    // console.log(passwdLoginFormRef)
    const validateResult = await passwdLoginFormRef.value.validate()
    // console.log(!!validateResult.valid)
    if (!validateResult.valid) {
      return
    }
    loginBtnLoading.value = true
    // console.log(Object.values(passwdLoginForm.value))
    // debugger
    const data = encryption({
      data: passwdLoginForm.value,
      key: 'thanks,pig4cloud',
      param: ['password'],
    })
    const params: string[] = Object.values(data)
    try {
      const res = (await loginByPassword(...params)) as any
      // console.log(res)
      loginBtnLoading.value = false
      authStore.updateAuthInfo(res)
      router.push('/')
    } catch (err: any) {
      // console.error(err)
      if (err.response.data.msg) {
        errorMsg.value = err.response.data.msg
      } else {
        errorMsg.value = err.response.data.error
      }
      loginSnackbar.value = true
      loginBtnLoading.value = false
      refreshCode()
    }
  }

  /** 密码登录表单重置 */
  function handlePasswdLoginFormReset() {
    passwdLoginForm.value.username = ''
    passwdLoginForm.value.password = ''
    passwdLoginForm.value.code = ''
    passwdLoginFormRef.value.resetValidation()
  }

  /** 手机号登陆重置 */
  function handleSmsLoginFormReset() {
    smsLoginForm.value = {
      phone: '',
      code: '',
    }
  }

  /** 用户注册 */
  async function handleRegisterFormSubmit() {
    // console.log(registerForm)
    const validateResult = await registerFormRef.value.validate()
    // console.log(validateResult)
    if (!validateResult.valid) {
      return
    }
    registerUser(registerForm.value)
      .then((res: any) => {
        if (res.code) {
          errorMsg.value = res.msg
          loginSnackbar.value = true
        } else {
          handleRegisterFormReset()
        }
      })
      .catch((err) => {
        errorMsg.value = err.response.data.msg
        loginSnackbar.value = true
      })
  }

  /** 用户注册表单重置 */
  function handleRegisterFormReset() {
    registerFormRef.value.reset()
  }

  /** 生成随机数 */
  function randomLenNum(len: number, plusDate: boolean) {
    let num = ''
    num = Math.ceil(Math.random() * 100000000000000)
      .toString()
      .substring(0, len || 4)
    if (plusDate) {
      num += Date.now()
    }
    return num
  }

  /** 刷新验证码 */
  function refreshCode() {
    // console.log(123)
    passwdLoginForm.value.code = ''
    passwdLoginForm.value.randomStr = randomLenNum(code.value.len, true)
    code.value.type == 'text'
      ? (code.value.value = randomLenNum(code.value.len, false))
      : (code.value.src = `/api/code?randomStr=${passwdLoginForm.value.randomStr}`)
  }

  onMounted(() => {
    refreshCode()
  })
</script>

<style lang="scss">
  .mg-tittle {
    margin-top: 20px;
    margin-bottom: 50px;
  }
</style>
