<template>
  <div>
    <!--  按钮组  -->
    <el-card>
      <el-row>
        <el-button type="success" round icon="el-icon-back" @click="$router.go(-1)">返回列表</el-button>
        <el-button type="primary" round icon="el-icon-success" @click="save">保存设计</el-button>
        <el-button type="primary" round icon="el-icon-success" @click="drawer = true">引擎配置</el-button>
        <el-button type="primary" round icon="el-icon-success" @click="$refs.refFile.click()">导入XML</el-button>
        <el-button type="primary" round icon="el-icon-success" @click="$refs.refExcelFile.click()">导入Excel</el-button>
        <el-button circle icon="el-icon-success" @click="handlerUndo" />
        <el-button circle icon="el-icon-search" @click="handlerRedo" />
        <el-button circle icon="el-icon-zoom-in" @click="handlerZoom(0.1)" />
        <el-button circle icon="el-icon-zoom-out" @click="handlerZoom(-0.1)" />
        <el-button circle icon="el-icon-refresh-left" @click="handlerZoom(0)" />
        <input id="XMLFiles" ref="refFile" type="file" style="display: none" @change="loadXML">
        <input id="ExcelFiles" ref="refExcelFile" type="file" style="display: none" accept=".xlsx" @change="loadExcel($event)">
      </el-row>
    </el-card>
    <!--  bpmn containers  -->
    <div class="containers">
      <!--   工具栏   -->
      <div class="tool-panel">
        <div class="panel-header">
          <div class="panel-title">
            <span>工具面板:</span>
            <a class="layout-button-right" href="javascript:void(0)" style="display: none;" @click="(event) => expandToolPanel(event)" />
            <a class="layout-button-left" href="javascript:void(0)" @click="(event) => foldToolPanel(event)" />
          </div>
        </div>
        <div ref="palette" class="panel-body" />
      </div>
      <!--   BpmnModeler   -->
      <div ref="canvas" class="canvas">
        <div class="toolbar">
          <a title="download">下载</a>
          <a ref="saveDiagram" href="javascript:" title="download BPMN diagram">BPMN</a>
          <a ref="saveSvg" href="javascript:" title="download as SVG image">SVG</a>
        </div>
      </div>
      <!--   属性栏   -->
      <div class="properties-panel">
        <div class="panel-header">
          <div class="panel-title">
            <span>属性面板:</span>
            <a class="layout-button-left" href="javascript:void(0)" style="display: none;" @click="(event) => expandPropertiesPanel(event)" />
            <a class="layout-button-right" href="javascript:void(0)" @click="(event) => foldPropertiesPanel(event)" />
          </div>
        </div>
        <div ref="propertiesPanel">
          <jbinfoPropertyPanel v-if="bpmnModeler" :modeler="bpmnModeler" />
        </div>
      </div>
    </div>
    <!--  引擎配置  -->
    <el-drawer
      title="引擎配置"
      :visible.sync="drawer"
      :direction="direction"
    >
      <!--   TODO 引擎配置项     -->
    </el-drawer>
  </div>
</template>

<script>
import BpmnModeler from 'bpmn-js/lib/Modeler'
import customModelerModels from '@/components/activiti/modeler/CustomModelerModels'

import BpmConfig from '@/components/activiti/template/BpmConfig'
import modelApi from '@/api/activiti/modelApi'
import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate
} from 'tiny-svg'
import {
  query as domQuery
} from 'min-dom'

import { Message } from 'element-ui'

// 自定义:右侧实现2
import jbinfoPropertyPanel from './CustomPropertyPanel' // 属性面板

// 翻译
import customTranslate from '@/components/activiti/translate/customTranslate'

// 自定义:左侧工具栏
import customPaletteProvider from '@/components/activiti/palette'
import paletteEntries from '@/components/activiti/palette/PaletteEntries'
// 描述文件
import etlExtension from '@/components/activiti/template/etl.json'
import activitiDescriptor from '@/components/activiti/descriptors/activitiDescriptor.json'
import minimapModule from 'diagram-js-minimap'
export default {
  components: {
    jbinfoPropertyPanel
  },
  data() {
    return {
      bpmnModeler: null,
      element: null,
      bpmData: null,
      model: {},
      drawer: false, // 引擎配置页开关
      direction: 'btt',
      scale: 1
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },
  created() {
    this.model = this.$route.query
    // 默认水平布局
    this.model.direction = this.model.metaInfo ? JSON.parse(this.model.metaInfo).direction : 'horizontal'
    this.bpmData = new BpmConfig(this.model.key, this.model.name, this.model.description)
  },
  methods: {
    // 初始化模型
    init() {
      // 先获取当前的Model信息。
      this.getModel().then(() => {
        // 获取容器
        const canvas = this.$refs.canvas
        const palette = this.$refs.palette

        // 翻译模块
        const customTranslateModule = {
          translate: ['value', customTranslate]
        }

        // 去除默认工具栏
        const modules = BpmnModeler.prototype._modules
        const index = modules.findIndex(it => it.paletteProvider)
        modules.splice(index, 1)

        // 生成实例
        this.bpmnModeler = new BpmnModeler({
          container: canvas,
          // 工具栏容器
          paletteContainer: palette,
          // 工具栏配置及实现自定义渲染方法
          paletteEntries: paletteEntries,
          // 添加控制板
          propertiesPanel: {
            parent: '#js-properties-panel'
          },
          // 开启键盘快捷
          keyboard: {
            bindTo: document
          },
          additionalModules: [
            // 修改官方属性栏渲染
            /* propertiesPanelModule,
            JBInfoPropertiesProvider,*/
            // 小地图
            minimapModule,
            // 自定义工具栏
            customPaletteProvider,
            customTranslateModule,
            // 自定义Modeler.contextPadProvider,Modeler.customRenderer
            customModelerModels
          ],
          moddleExtensions: {
            /* magic: magicModuleDescriptor,*/
            etl: etlExtension,
            self: activitiDescriptor
          }
        })
        const modeling = this.bpmnModeler.get('modeling')
        modeling._direction = this.model.direction
        // 新增流程定义
        this.createNewDiagram()

        // 调整与正中间
        /* this.bpmnModeler.get('canvas').zoom('fit-viewport', 'auto')*/

        // 初始化箭头
        this.initArrow('sequenceflow-arrow-normal')
        this.initArrow('sequenceflow-arrow-active')

        // 默认打开 minimap
        this.bpmnModeler.get('minimap').close()
      })
    },
    createNewDiagram() {
      // 将字符串转换成图显示出来
      if (this.model.sourceUrl) {
        this.bpmnModeler.importXML(this.model.sourceUrl, err => {
          if (err) {
            console.error(err)
          } else {
            this.success()
          }
        })
      }
    },
    success() {
      this.addBpmnListener()
      this.addEventBusListener()
    },
    // 添加绑定事件
    addBpmnListener() {
      const that = this
      // 获取a标签dom节点
      const downloadLink = this.$refs.saveDiagram
      const downloadSvgLink = this.$refs.saveSvg
      // 给图绑定事件，当图有发生改变就会触发这个事件
      this.bpmnModeler.on('commandStack.changed', function() {
        that.saveSVG(function(err, svg) {
          that.model.sourceSVG = svg
          that.setEncoded(downloadSvgLink, 'diagram.svg', err ? null : svg)
        })
        that.saveDiagram(function(err, xml) {
          that.model.sourceUrl = xml
          that.setEncoded(downloadLink, 'diagram.bpmn', err ? null : xml)
        })
      })
    },
    // 监听Element并绑定事件
    addEventBusListener() {
      const eventBus = this.bpmnModeler.get('eventBus')
      const eventTypes = ['element.click', 'element.changed']
      // eslint-disable-next-line consistent-this
      const _this = this

      eventTypes.forEach(eventType => {
        eventBus.on(eventType, e => {
          // 排除根节点
          if (!e || e.element.type === 'bpmn:process') {
            return
          }
          if (eventType === 'element.changed') {
            console.log('元素改变' + e.element.type)
            _this.elementChanged(e)
          } else if (eventType === 'element.click') {
            console.log('元素点击' + e.element.type)
          }
        })
      })
    },
    // 下载为SVG格式,done是个函数，调用的时候传入的
    saveSVG(done) {
      // 把传入的done再传给bpmn原型的saveSVG函数调用
      this.bpmnModeler.saveSVG(done)
    },
    // 下载为SVG格式,done是个函数，调用的时候传入的
    saveDiagram(done) {
      // 把传入的done再传给bpmn原型的saveXML函数调用
      this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
        done(err, xml)
      })
    },
    // 当图发生改变的时候会调用这个函数，这个data就是图的xml
    setEncoded(link, name, data) {
      // 把xml转换为URI，下载要用到的
      const encodedData = encodeURIComponent(data)
      // 获取到图的xml，保存就是把这个xml提交给后台
      this.xmlStr = data
      // 下载图的具体操作,改变a的属性，className令a标签可点击，href令能下载，download是下载的文件的名字
      if (data) {
        link.className = 'active'
        link.href = 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData
        link.download = name
      }
    },
    // 保存
    async save() {
      const res = await modelApi.saveModel(this.model)
      if (res.code === 1000) {
        Message.success({
          type: 'success',
          message: '保存成功'
        })
      } else {
        Message.error({
          type: 'error',
          message: res.data.exception
        })
      }
    },
    // 获取模型数据
    async getModel() {
      if (!this.model || !this.model.id) {
        Message.error({ type: 'error', message: '请返回重新选择模型' })
        return
      }

      const res = await modelApi.getModel(this.model)
      if (res && res.code === 1000) {
        this.model.sourceUrl = res.data.sourceUrl
      }
      // 根据分类ID获取分类下的通用工具
      if (!res.data.category) { return }
      const paletteRes = await modelApi.getPaletteByCategoryId({ categoryId: res.data.category })
      if (paletteRes && paletteRes.code === 1000) {
        paletteEntries.commonPalette = paletteRes.data
      }
    },
    elementChanged(e) {
      const shape = this.getShape(e.element.id)
      if (!shape) {
        // 若是shape为null则表示删除, 无论是shape还是connect删除都调用此处
        console.log('无效的shape')
        // 上面已经用 shape.removed 检测了shape的删除, 要是删除shape的话这里还会被再触发一次
        console.log('删除了shape和connect')
        return
      }
      if (!this.isInvalid(shape.type)) {
        if (this.isSequenceFlow(shape.type)) {
          console.log('改变了线')
        }
      }
    },
    getShape(id) {
      const elementRegistry = this.bpmnModeler.get('elementRegistry')
      return elementRegistry.get(id)
    },
    isInvalid(param) {
      // 判断是否是无效的值
      return param === null || param === undefined || param === ''
    },
    isSequenceFlow(type) {
      // 判断是否是线
      return type === 'bpmn:SequenceFlow'
    },
    /**
     * tree节点点击
     */
    handleNodeClick() {
      console.log('aaa')
    },
    // 初始化自定义箭头
    initArrow(id) {
      const marker = svgCreate('marker')

      svgAttr(marker, {
        id,
        viewBox: '0 0 20 20',
        refX: '11',
        refY: '10',
        markerWidth: '10',
        markerHeight: '10',
        orient: 'auto'
      })

      const path = svgCreate('path')

      svgAttr(path, {
        d: 'M 1 5 L 11 10 L 1 15 Z',
        style:
          ' stroke-width: 1px; stroke-linecap: round; stroke-dasharray: 10000, 1; '
      })

      const defs = domQuery('defs')
      svgAppend(marker, path)
      svgAppend(defs, marker)
    },
    /**
     * XML导入流程设计
     */
    async loadXML() {
      const that = this
      const file = this.$refs.refFile.files[0]

      const reader = new FileReader()
      reader.readAsText(file)
      reader.onload = function() {
        that.model.sourceUrl = this.result
        that.createNewDiagram()
      }
    },
    /**
     * Excel导入流程设计
     * @returns {Promise<void>}
     */
    async loadExcel(event) {
      const file = event.target.files[0]
      const fileName = file.name
      const idx = fileName.lastIndexOf('.')
      if (idx !== -1) {
        let extName = fileName.substr(idx + 1).toUpperCase()
        extName = extName.toLowerCase()
        if (extName !== 'xlsx') {
          Message.error({
            type: 'error',
            message: '仅支持上传2007版的Excel文件'
          })
        } else {
          const formData = new FormData()
          formData.append('modelId', this.model.id)
          formData.append('modelName', this.model.name)
          formData.append('modelDescription', this.model.description)
          formData.append('file', file)
          modelApi.uploadExcelOfModel(formData).then(res => {
            if (res.code === 1000) {
              this.model.sourceUrl = res.data
              this.createNewDiagram()
            }
          })
        }
      } else {
        Message.error({
          type: 'error',
          message: '非标准文件'
        })
      }
    },
    handlerRedo() {
      this.bpmnModeler.get('commandStack').redo()
    },
    handlerUndo() {
      this.bpmnModeler.get('commandStack').undo()
    },

    handlerZoom(radio) {
      const newScale = !radio ? 1.0 : this.scale + radio
      this.bpmnModeler.get('canvas').zoom(newScale)

      this.scale = newScale
    },
    foldToolPanel(event) {
      const toolPanel = this.$refs.palette
      toolPanel.parentElement.style.width = '30px'
      toolPanel.childNodes[0].style.display = 'none'

      event.target.style.display = 'none'
      event.target.previousElementSibling.style.display = 'block'
    },
    expandToolPanel(event) {
      const toolPanel = this.$refs.palette
      toolPanel.parentElement.style.width = '200px'
      toolPanel.childNodes[0].style.display = 'block'

      event.target.style.display = 'none'
      event.target.nextElementSibling.style.display = 'block'
    },
    foldPropertiesPanel(event) {
      const propertiesPanel = this.$refs.propertiesPanel
      propertiesPanel.parentElement.style.width = '30px'
      propertiesPanel.childNodes[0].style.display = 'none'

      event.target.style.display = 'none'
      event.target.previousElementSibling.style.display = 'block'
    },
    expandPropertiesPanel(event) {
      const propertiesPanel = this.$refs.propertiesPanel
      propertiesPanel.parentElement.style.width = '250px'
      propertiesPanel.childNodes[0].style.display = 'block'

      event.target.style.display = 'none'
      event.target.nextElementSibling.style.display = 'block'
    }

  }
}
</script>
<style lang="scss" src="./Modeler.scss"/>
<style lang="less" src="./bpmn.less"/>
