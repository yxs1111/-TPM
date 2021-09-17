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
      ]
    };
  },
  directives: { elDragDialog, permission },
  mounted() {},
  computed: {},
  methods: {}
};
