<template>
  <div class="app-container">
    说明文档地址:https://xuliangzhan_admin.gitee.io/vxe-table/
    <!--查询结果-->
    <vxe-table
      ref="sampleTable"
      :data="osInfoPageProps.records"
      element-loading-text="正在查询"
      border
      fit
      height="600"
      highlight-current-row
      :edit-config="{trigger: 'click', mode: 'cell'}"
    >
      <vxe-table-column label="序号" type="seq" width="60" />
      <vxe-table-column label="系统名称" align="center" field="name" :edit-render="{name: 'input', immediate: true, attrs: {type: 'text'}}" />
      <vxe-table-column label="创建人" align="center" field="createBy" :edit-render="{name: 'input', immediate: true, attrs: {type: 'text'}}" />
      <vxe-table-column align="center" label="创建时间" field="createDate" :edit-render="{name: '$input', props: {type: 'date'}}" />
      <vxe-table-column label="锁定状态" align="center" field="locked" :edit-render="{name: '$select', options: lockedList}" />
    </vxe-table>
    <!--分页-->
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="osInfoPageProps.total"
      :page-size="osInfoPageProps.pageSize"
      :current-page="osInfoPageProps.pageNum"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script src="./index.js">

</script>
<style lang="scss" scoped>
</style>
