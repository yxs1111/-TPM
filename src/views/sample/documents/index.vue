<template>
  <div class="documents">
    <el-button type="primary" @click="wordToXml">Word文件转换为Xml文件</el-button>
    <el-button type="success" @click="xmlToWord">Xml文件转换为Word文件</el-button>
    <el-button type="primary" @click="wordToHtml">Word文件转换为Html文件</el-button>
    <el-button type="success" @click="htmlToWord">Html文件转换为Word文件</el-button>
    <el-button type="primary" @click="pdfToWord">Pdf文件转换为Word文件</el-button>
    <el-button type="primary" @click="dFile">Pdf文件转换为Word文件</el-button>
    <br><br>
    <div>{{ convertWordToXml }}</div>
  </div>
</template>

<script src="./index.js">

</script>
