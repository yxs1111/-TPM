
export default {
  name: 'I18n',
  data() {
    return {
      locale: 'zh'
    }
  },
  computed: {
    lang: {
      get() {
        return this.$store.state.app.language
      },
      set(lang) {
        this.handleChange(lang)
      }
    }
  },
  watch: {
    lang() {
      this.locale = this.$i18n.locale
    }
  },
  methods: {
    // 设置语言
    handleChange(val) {
      this.$i18n.locale = val
      this.$store.dispatch('app/setLanguage', val)
    }
  }
}
