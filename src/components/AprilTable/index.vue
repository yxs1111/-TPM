<template>
  <div class="app-container" :style="{height: boxHeight}">
    <div class="april-components" @keyup.enter="fetchData">
      <!--查询条件-->
      <el-form ref="aprilFilter" :model="queryParams" :label-width="`${labelWidth}px`" class="april-filter">
        <template v-for="item in columns">
          <slot v-if="item.search">
            <el-form-item :label="item.label" :prop="item.prop" class="el-col-6">
              <slot v-if="item.type === 'select'">
                <el-select v-model="queryParams[item.prop]" :name="item.prop" filterable clearable :placeholder="`请选择${item.label}`" style="width: 100%;">
                  <el-option v-for="(opt) in combobox[item.prop]" :key="opt.value" :label="opt.label" :value="opt.value" />
                </el-select>
              </slot>
              <slot v-if="item.type === 'time'">
                <el-time-picker
                  v-model="queryParams[item.prop]"
                  style="width: 100%;"
                  :name="item.prop"
                  :picker-options="item.pickerOptions"
                  :value-format="item.valueFormat"
                  :default-value="item.defaultValue"
                  :is-range="item.isRange"
                  range-separator="至"
                  start-placeholder="起始时间"
                  end-placeholder="截止时间"
                  placeholder="选择时间范围"
                />
              </slot>
              <slot v-if="item.type === 'date' || item.type === 'daterange'">
                <el-date-picker
                  v-model="queryParams[item.prop]"
                  style="width: 100%;"
                  :type="item.type"
                  :name="item.prop"
                  :picker-options="item.pickerOptions"
                  :format="item.format"
                  :value-format="item.valueFormat"
                  :default-value="item.defaultValue"
                  range-separator="至"
                  start-placeholder="起始日期"
                  end-placeholder="截止日期"
                  :placeholder="`请选择${item.label}`"
                />
              </slot>
              <slot v-if="item.type === 'datetime' || item.type === 'datetimerange'">
                <el-date-picker
                  v-model="queryParams[item.prop]"
                  style="width: 100%;"
                  :type="item.type"
                  :name="item.prop"
                  :picker-options="item.pickerOptions"
                  :format="item.format"
                  :value-format="item.valueFormat"
                  :default-value="item.defaultValue"
                  range-separator="至"
                  start-placeholder="起始日期时间"
                  end-placeholder="截止日期时间"
                  :placeholder="`请选择${item.label}`"
                />
              </slot>
              <slot v-if="item.type === undefined || item.type === 'text'">
                <el-input v-model="queryParams[item.prop]" :name="item.prop" :placeholder="`请输入${item.label}`" />
              </slot>
            </el-form-item>
          </slot>
        </template>
        <el-form-item class="el-col-6 filter-buttons">
          <el-button v-permission="permissions['get']" type="primary" icon="el-icon-search" :loading="searchLoading" @click="fetchData">{{ $t('table.search') }}</el-button>
          <el-button v-permission="permissions['get']" icon="el-icon-refresh" :loading="searchLoading" @click="reset">{{ $t('table.reset') }}</el-button>
        </el-form-item>
      </el-form>
      <div class="table-buttons">
        <div class="table-buttons-left">
          <el-button v-permission="permissions['insert']" type="primary" icon="el-icon-plus" @click="handleAdd">{{ $t('table.add') }}</el-button>
          <el-button v-permission="permissions['delete']" type="danger" icon="el-icon-delete" :loading="removeLoading" :disabled="removeEnable" @click="handleRemove()">{{ $t('table.delete') }}</el-button>
          <slot name="leftButtons" />
        </div>
        <div class="table-buttons-right">
          <slot name="rightButtons" />
          <el-button v-permission="permissions['import']" size="mini" icon="el-icon-upload" :title="$t('table.import')" @click="fetchData()" />
          <el-button v-permission="permissions['export']" size="mini" icon="el-icon-download" :title="$t('table.export')" @click="fetchData()" />
          <el-button v-permission="permissions['get']" size="mini" icon="el-icon-refresh" :title="$t('table.refresh')" @click="fetchData()" />
          <el-button size="mini" icon="el-icon-setting" :title="$t('table.column')" @click="() => {this.$message.info('暂未实现')}" />
        </div>
      </div>
      <el-table
        ref="aprilTable"
        v-loading="searchLoading"
        v-bind="$attrs"
        :data="data"
        :height="tableHeight"
        :header-cell-class-name="cellClass"
        element-loading-text="正在查询"
        border
        fit
        stripe
        :show-header="showHeader"
        :highlight-current-row="true"
        :current-row-key="primaryKey"
        :header-cell-style="{ background: '#F3F4F7', height: '40px' }"
        v-on="$listeners"
        @selection-change="selectionChange"
        @row-click="rowClick"
        @row-dblclick="rowDblClick"
      >
        <el-table-column align="center" type="selection" width="50" />
        <el-table-column v-if="rowIndex" align="center" prop="rowIndex" name="rowIndex" :label="$t('table.index')" width="50">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <template v-if="permissions['get']">
          <el-table-column align="center" :label="$t('table.view')" width="50">
            <slot slot-scope="scope">
              <el-button size="mini" icon="el-icon-view" :title="$t('table.detail')" circle @click.stop="handleView(scope.row)" />
            </slot>
          </el-table-column>
        </template>
        <template v-for="col in columns">
          <slot v-if="col.display !== false">
            <el-table-column :prop="col.prop" :label="col.label" :width="col.width" :sortable="col.sort" :header-align="$attrs['header-align']" :align="col.align || 'center'">
              <slot slot-scope="scope" :name="col.prop" :row="scope.row">{{ scope.row[col.prop] }}</slot>
            </el-table-column>
          </slot>
        </template>
        <template v-if="operation">
          <el-table-column align="center" name="rowButtons" :label="$t('table.operation')" :width="rowBtnWidth">
            <slot slot-scope="scope">
              <el-button v-permission="permissions['update']" size="mini" type="primary" icon="el-icon-edit" :title="$t('table.edit')" circle @click.stop="handleEdit(scope.row)" />
              <el-button v-permission="permissions['delete']" size="mini" type="danger" icon="el-icon-delete" :title="$t('table.delete')" circle @click.stop="handleRemove(scope.row)" />
              <slot name="rowButtons" :row="scope.row" />
            </slot>
          </el-table-column>
        </template>
      </el-table>
      <template v-if="pagination">
        <el-pagination
          class="pagination"
          layout="sizes, prev, pager, next, jumper, ->, total"
          :current-page.sync="pagination.currentPage"
          :page-sizes="[10, 15, 25, 50, 100]"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          @size-change="changeSize"
          @current-change="changePage"
        />
      </template>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/request-api'
import permission from '@/directive/permission'
import { validateNull } from '@/utils/validate'
import { getDefaultPermissions } from '@/utils'

export default {
  directives: { permission },
  props: {
    labelWidth: { type: Number, default: 80, required: false }, // 检索项文本宽度
    rowBtnWidth: { type: Number, default: 120, required: false }, // 检索项文本宽度
    pagination: {
      type: Object,
      default: () => {
        return {
          total: { type: Number, default: 0, required: false }, // 分页数据总数
          pageSize: { type: Number, default: 10, required: false }, // 单页数据量
          currentPage: { type: Number, default: 1, required: false } // 当前页码
        }
      },
      required: false
    },
    data: { type: Array, default: () => [], required: true }, // 表格数据
    columns: { type: Array, default: () => [], required: true }, // 表头数据
    showHeader: { type: Boolean, default: true, required: false }, // 显示表头
    rowIndex: { type: Boolean, default: false, required: false }, // 显示行序
    operation: { type: Boolean, default: true, required: false }, // 显示操作列
    multiple: { type: Boolean, default: true, required: false }, // 是否多选
    primaryKey: { type: String, default: 'id', required: false } // 数据主键
  },
  data() {
    return {
      tableHeight: 0,
      boxHeight: 0,
      searchLoading: false,
      removeLoading: false,
      removeEnable: true,
      currentRow: {},
      selectRows: [],
      queryParams: {}, // 检索条件
      combobox: {},
      radioModel: `radio${new Date().getTime()}`,
      permissions: getDefaultPermissions() // 权限信息
    }
  },
  computed: {
    ids() {
      const ids = []
      this.selectRows.forEach(ele => {
        ids.push(ele.id)
      })
      return ids.join(',')
    }
  },
  created() {
    this.fetchData()
  },
  mounted() {
    // 计算界面高度
    if (this.$el) {
      const boxH = this.$el.parentElement.clientHeight
      const filterH = this.$el.querySelector('.april-filter').clientHeight
      this.boxHeight = `${boxH}px`
      this.tableHeight = `${boxH - filterH - 90 - (this.$props.operation ? 50 : 0) - 2}px`
    }
    // Combobox初始化加载
    this.initCombobox()
  },
  methods: {
    async initCombobox() {
      const _this = this
      const columns = _this.$props.columns || []
      for (const col of columns) {
        const opts = col.selOpts || {}
        if (col.type !== 'select') continue
        const list = opts.data || []
        if (list.length === 0) {
          if (!opts.url) continue
          const res = await requestApi.request_get(opts.url, opts.params)
          const records = res.data || []
          records.forEach(v => {
            list.push({ label: v[opts.label || 'label'], value: v[opts.value || 'value'] })
          })
        }
        _this.combobox[col.prop] = list
      }
      _this.$forceUpdate()
    },
    cellClass(row) {
      if (row.columnIndex === 0 && !this.$props.multiple) {
        return 'DisableSelection'
      }
    },
    fetchData() {
      this.searchLoading = true
      if (this.$props.pagination) {
        this.queryParams.pageSize = this.$props.pagination.pageSize
        this.queryParams.pageNum = this.$props.pagination.currentPage
      }
      const callback = () => {
        this.searchLoading = false
        this.selectRows = []
        this.$refs.aprilTable.toggleRowSelection()
      }
      this.$emit('handle-query', this.queryParams, callback)
    },
    reset() {
      this.$refs.aprilFilter.resetFields()
      this.$props.pagination.currentPage = 1
      this.$props.pagination.pageSize = 10
      this.fetchData()
    },
    handleAdd() {
      this.$emit('handle-add')
    },
    handleView(row) {
      this.$emit('handle-view', row)
    },
    handleEdit(row) {
      this.$emit('handle-edit', row)
    },
    handleRemove(row) {
      const callback = () => {
        this.removeLoading = false
        this.removeEnable = true
        this.fetchData()
      }
      this.removeLoading = true
      if (validateNull(row)) {
        this.$emit('handle-remove', this.ids, callback)
      } else {
        this.$emit('handle-remove', row[this.primaryKey], callback)
      }
    },
    changePage: function(currentPage) {
      this.$props.pagination.currentPage = currentPage
      this.fetchData()
    },
    changeSize: function(pageSize) {
      this.$props.pagination.pageSize = pageSize
      this.fetchData()
    },
    // 当选择项发生变化时会触发该事件
    selectionChange(selection) {
      if (!this.$props.multiple && selection.length > 1) {
        this.currentRow = selection.pop()
        this.selectRows = [this.currentRow]
        this.$refs.aprilTable.clearSelection()
        this.$refs.aprilTable.toggleRowSelection(this.currentRow)
      } else {
        this.selectRows = selection
      }
      this.removeEnable = this.selectRows.length === 0
    },
    // 当某一行被点击时会触发该事件
    rowClick(row) {
      this.$refs.aprilTable.toggleRowSelection(row)
    },
    // 当某一行被双击时会触发该事件
    rowDblClick(row, column, event) {
      this.$emit('handle-view', row)
    }
  }
}
</script>

<style scoped>
.april-components {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  flex-direction: column;
}

.april-components .filter-buttons {
  text-align: left;
}

.april-components .table-buttons {
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 10px;
}

.april-components .table-buttons .table-buttons-left {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  justify-content: flex-start;
  text-align: left;
}

.april-components .table-buttons .table-buttons-right {
  width: 190px;
  text-align: right;
}

.april-components .table-buttons .table-buttons-right .el-button--mini {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  font-size: 24px;
  padding: 0;
}

.april-components .pagination {
  text-align: center;
  padding-top: 20px;
}

/deep/ .el-table__header-wrapper .DisableSelection .el-checkbox {
  display: none;
}
</style>
