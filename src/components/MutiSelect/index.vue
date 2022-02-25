<!--
 * @Description: 
 * @Date: 2022-02-25 10:21:21
 * @LastEditTime: 2022-02-25 11:23:03
-->
<template>
  <el-select multiple collapse-tags v-model="modelValue" :placeholder="placeholder" :clearable="clearable" :filterable="filterable" :disabled="disabled" @change="handleChange"
    v-bind="$attrs" v-on="$listeners">
    <el-tag type="primary" class="select-tag-class" @click="handleSelectAll">{{tagLabel}}</el-tag>
    <el-option v-for="(item, index) in list" :key="index" :disabled="item[optionDisabled]" :label="item[optionLabel]" :value="item[optionValue]">
    </el-option>
  </el-select>
</template>
 
<script>
export default {
  name: 'ElMultipleSelect',
  props: {
    list: {
      type: Array,
      required: true,
      default: [],
    },
    props: {
      type: Object,
      required: false,
      default: () => {
        return {
          value: 'value',
          label: 'label',
          disabled: 'disabled',
        }
      },
    },
    value: {
      type: Array,
      required: false,
      default: [],
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    placeholder: {
      type: String,
      required: false,
      default: '请选择',
    },
    clearable: {
      type: Boolean,
      required: false,
      default: true,
    },
    filterable: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return {
      selectAll: false, // 全选标记
    }
  },
  computed: {
    optionValue: {
      get() {
        return this.props.value || 'value'
      },
    },
    optionLabel: {
      get() {
        return this.props.label || 'label'
      },
    },
    optionDisabled: {
      get() {
        return this.props.disabled || 'disabled'
      },
    },
    modelValue: {
      get() {
        return this.value
      },
      set(value) {
        // 通知父组件修改v-model的值
        this.$emit('input', value)
      },
    },
    tagLabel: {
      get() {
        return this.selectAll ? '清空' : '全选'
      },
    },
  },
  watch: {
    modelValue: {
      handler: function (modelValue) {
        // console.log(this.optionValue)
        // 如果值为空，修改当前全选状态为false
        if (JSON.stringify(modelValue) === '[]') {
          this.selectAll = false
        } else if (
          this.list.every((item) => modelValue.includes(item[this.optionValue]))
        ) {
          this.selectAll = true
        }
      },
      immediate: true,
    },
  },
  methods: {
    handleSelectAll() {
      this.selectAll = !this.selectAll
      const list = []
      if (this.selectAll) {
        this.list.forEach((item) => list.push(item[this.optionValue]))
      }
      this.modelValue = list
      this.handleChange(list)
    },
    handleChange(value) {
      // 通知父组件
      this.$emit('handleChange', value)
    },
  },
}
</script>
 
<style lang="less" scoped>
.select-tag-class {
  width: 96%;
  /*margin: 0 2% 1% 2%;*/
  margin: 2%;
  text-align: center;
  border-color: #b3d8ff;
  cursor: pointer;
}

.select-tag-class:hover {
  background-color: rgb(226, 240, 255);
}

.select-tag-class:active {
  background-color: #d9ecff;
}
</style>
