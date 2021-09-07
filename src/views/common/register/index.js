import { isMobile } from '@/utils/validate'

export default {
  name: 'Register',
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!isMobile(value) && this.active === 0) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    const validateCode = (rule, value, callback) => {
      if (!value && this.active === 0) {
        callback(new Error('请输入验证码'))
      } else {
        callback()
      }
    }
    return {
      active: 0,
      space: 300,
      registerForm: {
        phone: '',
        code: ''
      },
      rules: {
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        code: [{ required: true, trigger: 'blur', validator: validateCode }]
      },
      loading: false,
      options: [{
        value: '0086',
        label: '0086'
      }],
      value: '0086'
    }
  },
  mounted() {
    console.log('hi')
  },
  methods: {
    next() {
      this.$refs['registerForm'].validate(valid => {
        if (valid) {
          if (this.active < 3) {
            this.active++
          }
        }
      })
    },
    pre() {
      if (this.active > 0) {
        this.active--
      }
    },
    handleRegister() {
      console.log('register')
    }
  }
}
