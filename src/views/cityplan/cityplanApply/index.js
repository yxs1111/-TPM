import { getDefaultPermissions, parseTime, getTextMap } from '@/utils'
import permission from '@/directive/permission'
import elDragDialog from '@/directive/el-drag-dialog'
export default {
  data() {
    return {
      categoryArr: [
        { label: '19号线', value: '19' }
      ],
      permissions: getDefaultPermissions(),
      month:'',
      SKU:'',
      isMask:false,
      currentIndex:0,
      TabViewList:[
        {title:'V0',path:'V0'},
        {title:'V1',path:'V1'},
        // {title:'V2',path:'V2'},
        // {title:'V3',path:'V3'},
      ],
      TabTitle:'',
    }
  },
  directives: { elDragDialog, permission },
  mounted() {
    if(sessionStorage.getItem('TabIndex')) {
      this.currentIndex=sessionStorage.getItem('TabIndex');
      
    } else {
      this.currentIndex=0;
    }
    this.TabTitle=this.TabViewList[this.currentIndex].title;
  },
  computed: {
  },
  methods: {
    //移入显示tab
    showMask() {
      this.isMask=true;
    },
    //切换
    changeTab(index) {
      this.currentIndex=index;
      sessionStorage.setItem('TabIndex',index)
    },
    //移出隐藏
    hiddenMask() {
      this.isMask=false;
    }
  }
}
