import request from '@/utils/request'

export default {
  name: 'documents',
  data() {
    return {
      convertWordToXml: null
    }
  },
  methods: {
    // 调用后端方法 word文件转换为XML文件
    wordToXml() {
      request.get('/base/documents/wordToXml').then(response => {
        this.convertWordToXml = response.data
      }).catch(error => {
        console.dir(error)
      })
    },
    // 调用后端方法 xml文件转换为word文件
    xmlToWord() {
      request.get('/base/documents/xmlToWord').then(response => {
        this.convertWordToXml = response.data
      }).catch(error => {
        console.dir(error)
      })
    },
    // 调用后端方法 word文件转换为html文件
    wordToHtml() {
      request.get('/base/documents/wordToHtml').then(response => {
        this.convertWordToXml = response.data
      }).catch(error => {
        console.dir(error)
      })
    },
    // 调用后端方法 html文件转换为word文件
    htmlToWord() {
      request.get('/base/documents/htmlToWord').then(response => {
        this.convertWordToXml = response.data
      }).catch(error => {
        console.dir(error)
      })
    },
    // 调用后端方法 pdf文件转换为word文件
    pdfToWord() {
      request.get('/base/documents/pdfToWord').then(response => {
        this.convertWordToXml = response.data
      }).catch(error => {
        console.dir(error)
      })
    }, // 调用后端方法 pdf文件转换为word文件
    dFile() {
      request.get('/base/documents/file').then(response => {
        this.convertWordToXml = response.data
      }).catch(error => {
        console.dir(error)
      })
    }
  }
}
