import { getDefaultPermissions, parseTime, getTextMap } from "@/utils";
import permission from "@/directive/permission";
import elDragDialog from "@/directive/el-drag-dialog";
export default {
  data() {
    return {
      categoryArr: [{ label: "19号线", value: "19" }],
      permissions: getDefaultPermissions(),
      month: "",
      SKU: "",
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      tableData: [
        {
          id: "1",
          name: "王小虎",
          amount1: 4,
          amount2: 3,
          amount3: 10,
          NKA: 0,
        },
        {
          id: "1",
          name: "王小虎",
          amount1: "165",
          amount2: 2,
          amount3: 12,
          NKA: 0,
        },
        {
          id: "2",
          name: "王小虎",
          amount1: 221,
          amount2: 3,
          amount3: 9,
          NKA: 0,
        },
        {
          id: "2",
          name: "王小虎",
          amount1: 221,
          amount2: 4,
          amount3: 17,
          NKA: 0,
        },
        {
          id: "3",
          name: "王小虎",
          amount1: 20,
          amount2: 4,
          amount3: 15,
          NKA: 0,
         

        }
      ],
      spanArr:[],
      pos:'',
    };
  },
  directives: { elDragDialog, permission },
  mounted() {
    this.getSpanArr(this.tableData)
  },
  computed: {
   
  },
  methods: {
    
    //合并行
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      
      // columnIndex === xx 找到第xx列，实现合并随机出现的行数
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      } 
      if(columnIndex === 5) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    },
    // 因为要合并的行数是不固定的，此函数是实现合并随意行数的功能
    getSpanArr(data) {
     
      this.spanArr = [];
      this.pos = 0;
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          // 如果是第一条记录（即索引是0的时候），向数组中加入１
          this.spanArr.push(1);
          this.pos = 0;
        } else {
          if (data[i].id === data[i - 1].id && data[i].NKA === data[i - 1].NKA) {
            // 如果id相等就累加，并且push 0
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            // 不相等push 1
            this.spanArr.push(1);
            this.pos = i;
          }
        }
      }
      console.log(this.spanArr);
    },
  }
};
