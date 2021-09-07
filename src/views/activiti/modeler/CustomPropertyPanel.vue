<template>
  <div class="custom-properties-panel">
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item title="任务属性" name="task">
        <el-card shadow="hover">
          <div v-if="selectedElements.length<=0" class="empty">请选择一个元素</div>
          <div v-else-if="selectedElements.length>1" class="empty">只能选择一个元素</div>
          <div v-else>
            <fieldset class="element-item">
              <legend>任务信息</legend>
              <div>
                <label>任务类型</label>
                <select :value="taskType" @change="changeTaskType">
                  <option
                    v-for="option in taskTypes"
                    :key="option.label"
                    :value="option.value"
                  >{{ option.label }}</option>
                </select>
              </div>
              <div>
                <label>任务名:</label>
                <input :value="element.businessObject.name" @change="(event) => changeField(event, 'name')">
              </div>
              <div>
                <label>边框颜色</label>
                <input type="color" :value="element.color" @change="(event) => changeField(event, 'color')">
              </div>
            </fieldset>
            <el-button type="success" @click="assignTaskDialog.visible = true">分配任务</el-button>
            <el-button type="success" @click="bindFormDialog.visible = true">流程单据</el-button>
          </div>
        </el-card>
      </el-collapse-item>
      <el-collapse-item title="事件属性" name="event">
        <div v-if="selectedElements.length<=0" class="empty">请选择一个元素</div>
        <div v-else-if="selectedElements.length>1" class="empty">只能选择一个元素</div>
        <div v-else>
          <fieldset class="element-item">
            <legend>事件信息</legend>
            <div>
              <label>事件类型</label>
              <select :value="eventType" @change="changeEventType">
                <option
                  v-for="option in eventTypes"
                  :key="option.value"
                  :value="option.value"
                >{{ option.label }}</option>
              </select>
            </div>
            <div>
              <label>事件名称</label>
              <input :value="element.businessObject.name" @change="(event) => changeField(event, 'name')">
            </div>
          </fieldset>
        </div>
      </el-collapse-item>
      <el-collapse-item title="网关属性" name="gateway">
        <div v-if="selectedElements.length<=0" class="empty">请选择一个元素</div>
        <div v-else-if="selectedElements.length>1" class="empty">只能选择一个元素</div>
        <div v-else>
          <fieldset class="element-item">
            <legend>网关信息</legend>
            <div>
              <label>网关类型</label>
              <select :value="gateWayType" @change="changeGateWayType">
                <option
                  v-for="option in gateWayTypes"
                  :key="option.value"
                  :value="option.value"
                >{{ option.label }}</option>
              </select>
            </div>
            <div>
              <label>网关名称</label>
              <input :value="element.businessObject.name" @change="(event) => changeField(event, 'name')">
            </div>
          </fieldset>
        </div>
      </el-collapse-item>
    </el-collapse>
    <!--  分配任务Dialog Start  -->
    <assign-task
      :visible.sync="assignTaskDialog.visible"
      :assign-info="assignInfo"
      @submit="handleAssignTask"
    />
    <!--  分配任务Dialog End  -->
    <!--  绑定流程单据Dialog Start -->
    <bind-form
      :modeler="modeler"
      :visible.sync="bindFormDialog.visible"
      @submit="handleBindingForm"
    />
    <!--  绑定流程单据Dialog End -->
  </div>
</template>
<script src="./jbInfoPropertyPanel.js"/>

<style scoped>
.custom-properties-panel {
  position: relative;
  background-color: #fff9f9;
  border-color: rgba(0, 0, 0, 0.09);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
}
</style>
