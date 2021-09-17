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
    }
  },
  directives: { elDragDialog, permission },
  mounted() {
    
  },
  computed: {
  },
  methods: {
    
  }
}
