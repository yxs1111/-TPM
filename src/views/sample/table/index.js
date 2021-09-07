import requestApi from '@/api/request-api'
import osApi from '@/api/system/os-api'
import { parseTime } from '@/utils'

const url = osApi.url

export default {
  name: 'SampleTable',
  data() {
    return {
      lockedList: [
        { label: '已锁定', value: 1 },
        { label: '未锁定', value: 0 }
      ],
      osQuery: {
        name: '',
        locked: null,
        dataRange: '',
        startDate: '',
        endDate: ''
      },
      osInfoPageProps: {
        records: null,
        total: 0,
        pageSize: 10,
        pageNum: 1
      }
    }
  },
  created() {
    this.fetchData()
  },
  watch: {
    multipleSelection(val) {
      this.editDisabled = !(val && val.length === 1)
    }
  },
  methods: {
    // 查询方法
    fetchData() {
      requestApi.getPage(url, { pageSize: this.osInfoPageProps.pageSize, pageNum: this.osInfoPageProps.pageNum }).then(response => {
        const { data } = response
        this.osInfoPageProps.records = data.records
        this.osInfoPageProps.total = data.total
        this.osInfoPageProps.pageNum = data.pageNum
        this.osInfoPageProps.pageSize = data.pageSize
        this.searchLoading = false
      }).catch(error => {
        this.searchLoading = false
        console.log(error)
      })
    },
    // 每页显示页面数变更
    handleSizeChange(size) {
      this.osInfoPageProps.pageSize = size
      this.fetchData()
    },
    // 当前页变更
    handleCurrentChange(num) {
      this.osInfoPageProps.pageNum = num
      this.fetchData()
    },
    // 格式化时间
    parseJson(time, cFormat) {
      if (time == null) {
        return ''
      }
      return parseTime(time, cFormat)
    }
  }
}
