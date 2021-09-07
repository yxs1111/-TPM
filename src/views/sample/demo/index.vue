<template>
  <AprilTable
    ref="userInfo"
    header-align="center"
    primary-key="id"
    :label-width="labelWidth"
    :row-btn-width="rowBtnWidth"
    :row-index="true"
    :multiple="false"
    :data="data"
    :columns="columns"
    :pagination="page"
    @handle-add="handleAdd"
    @handle-view="handleView"
    @handle-edit="handleEdit"
    @handle-remove="handleDelete"
    @handle-query="handleQuery"
  >
    <template slot="leftButtons">
      <el-button type="primary" icon="el-icon-plus" @click="() => {this.$message.info('自定义工具栏按钮')}">自定义按钮</el-button>
    </template>
    <template slot="rowButtons" slot-scope="{row}">
      <el-button size="mini" type="primary" icon="el-icon-document" title="行内按钮" circle @click.stop="() => {this.$message.info(`自定义行内按钮，入参 = ${JSON.stringify(row)}`)}" />
    </template>
    <template slot="createDate" slot-scope="{row}">
      <em class="el-icon-time" />
      <span>{{ parseJson(row.createDate, '{y}-{m}-{d} {h}:{i}') }}</span>
    </template>
    <template slot="locked" slot-scope="{row}">
      <el-tag>{{ row.locked === '1' ? '已锁定' : '未锁定' }}</el-tag>
    </template>
  </AprilTable>
</template>

<script>
import AprilTable from '@/components/AprilTable'
import requestApi from '@/api/request-api'
import userApi from '@/api/system/user-api'
import { parseTime } from '@/utils'

const url = userApi.url

export default {
  components: { AprilTable },
  data() {
    return {
      labelWidth: 120,
      rowBtnWidth: 180,
      data: [],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      columns: [
        { label: '用户名', prop: 'name', align: 'left' },
        { label: '登录名', prop: 'loginName', search: true },
        { label: '创建人', prop: 'createBy' },
        { label: '创建时间', prop: 'createDate' },
        { label: '过期状态', prop: 'expireAt', search: true, type: 'select', selOpts: { url: 'auth/dict/info/listAllTypes', label: 'name', value: 'code' }},
        { label: '锁定状态', prop: 'locked', search: true, type: 'select', selOpts: { data: [{ label: '未锁定', value: '0' }, { label: '已锁定', value: '1' }] }}
      ]
    }
  },
  methods: {
    // 检索
    handleQuery(params, callback) {
      requestApi.getPage(url, params).then(response => {
        const { data } = response
        this.data = data.records
        this.page.total = data.total
        callback()
      }).catch(error => {
        console.log(error)
        callback()
      })
    },
    // 新增
    handleAdd() {
      this.$message.info('通用新增按钮事件')
    },
    // 详情
    handleView(params) {
      this.$message.info(`通用详情按钮事件，入参 = ${JSON.stringify(params)}`)
    },
    // 编辑
    handleEdit(params) {
      this.$message.info(`通用编辑按钮事件，入参 = ${JSON.stringify(params)}`)
    },
    // 删除
    handleDelete(ids, callback) {
      this.$message.info(`通用删除按钮事件，入参 = ${ids}`)
      callback()
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
</script>
