<template>
  <div class="custom-properties-panel">
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item title="任务属性" name="task">
        <div v-if="selectedElements.length <= 0" class="empty">请选择一个元素</div>
        <div v-else-if="selectedElements.length > 1" class="empty">只能选择一个元素</div>
        <div v-else>
          <fieldset class="element-item">
            <legend>基础信息</legend>
            <div>
              <label>类型:</label>
              <select :value="element.type" @change="changeElementType">
                <option
                  v-for="option in taskTypeOptions"
                  :key="option.label"
                  :value="option.value"
                >{{ option.label }}</option>
              </select>
            </div>
            <div>
              <label>名称:</label>
              <input :value="element.businessObject.name" @change="(event) => changeField(event, 'name')">
            </div>
            <div>
              <label>颜色:</label>
              <input type="color" :value="element.color" @change="(event) => changeField(event, 'color')">
            </div>
          </fieldset>
          <fieldset class="element-item">
            <legend>扩展信息</legend>
            <div>
              <label>优先级:</label>
              <input :value="element.businessObject.priority" @change="(event) => changeActivitiField(event,'priority')">
            </div>
          </fieldset>
          <fieldset class="element-item">
            <legend>其他配置</legend>
            <el-button size="mini" type="success" @click="assignTaskDialog.visible = true">分配任务</el-button>
            <!-- <el-button size="mini" type="success" @click="bindFormDialog.visible = true">流程单据</el-button> -->
          </fieldset>
        </div>
      </el-collapse-item>
      <el-collapse-item title="事件属性" name="event">
        <div v-if="selectedElements.length<=0" class="empty">请选择一个元素</div>
        <div v-else-if="selectedElements.length>1" class="empty">只能选择一个元素</div>
        <div v-else>
          <fieldset class="element-item">
            <legend>事件信息</legend>
            <div>
              <label>类型:</label>
              <select :value="element.type" @change="changeEventType">
                <option
                  v-for="option in eventTypeOptions"
                  :key="option.value"
                  :value="option.value"
                >{{ option.label }}</option>
              </select>
            </div>
            <div>
              <label>名称:</label>
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
              <label>类型:</label>
              <select :value="element.type" @change="changeElementType">
                <option
                  v-for="option in gateWayTypeOptions"
                  :key="option.value"
                  :value="option.value"
                >{{ option.label }}</option>
              </select>
            </div>
            <div>
              <label>名称:</label>
              <input :value="element.businessObject.name" @change="(event) => changeField(event, 'name')">
            </div>
          </fieldset>
        </div>
      </el-collapse-item>
      <el-collapse-item title="线" name="line">
        <div v-if="selectedElements.length <= 0" class="empty">请选择一个元素</div>
        <div v-else-if="selectedElements.length > 1" class="empty">只能选择一个元素</div>
        <div v-else>
          <fieldset class="element-item">
            <legend>连线</legend>
            <div>
              <label>名称:</label>
              <input :value="element.businessObject.name" @change="(event) => changeField(event, 'name')">
            </div>
            <div>
              <label>表达式:</label>
              <el-input v-model="element.sequenceExpression" @change="addConditionExpression" @input="$forceUpdate()"/>
            </div>
          </fieldset>
        </div>
      </el-collapse-item>
    </el-collapse>
    <!--  分配任务Dialog Start  -->
    <assign-task
      :visible.sync="assignTaskDialog.visible"
      :modeler="modeler"
    />
    <!--  分配任务Dialog End  -->
    <!--  绑定流程单据Dialog Start -->
    <bind-form
      :modeler="modeler"
      :visible.sync="bindFormDialog.visible"
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
