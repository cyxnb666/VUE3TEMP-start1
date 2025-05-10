<template>
  <a-form ref="formRef" :model="formData" class="queryForm">
    <a-flex wrap="wrap" gap="small">
      <a-form-item :span="6" v-for="(item, index) in configs" :key="index" :label="item.label + ':'" :name="item.prop"
        :autoLink="item.itemType !== 'input-range'">
        <a-input class="queryInput" v-if="item.itemType === 'a-input'" v-model:value="formData[item.prop]"
          :allow-clear="item.clearable || true" />
        <a-select class="querySelect" v-if="item.itemType === 'a-select'" v-model:value="formData[item.prop]"
          :fieldNames="item.fieldNames" :allow-clear="item.clearable || true" :options="item.options"
          @focus="focus(item.url, index)"></a-select>
        <a-tree-select class="querySelect" v-if="item.itemType === 'a-tree-select'" :fieldNames="item.fieldNames"
          v-model:value="formData[item.prop]" :allow-clear="item.clearable || true" :tree-data="item.options"
          :show-search="true" :tree-node-filter-prop="'areaname'"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" style="width: 200px"
          :placeholder="item.placeholder || '请选择'" @focus="focus(item.url, index)" @select="item.select" />
        <a-date-picker class="queryDatePicker" v-else-if="item.itemType === 'a-date-picker'"
          v-model:value="formData[item.prop]" :allow-clear="item.clearable || true" :picker="item.picker || 'date'"
          :disabled-date="item.disabledDate" :value-format="item.picker === 'year' ? 'YYYY' : 'YYYY-MM-DD'"
          :placeholder="item.placeholder || '请选择日期'" />
        <a-range-picker class="queryRangePicker" v-else-if="item.itemType === 'a-range-picker'"
          v-model:value="formData[item.prop]" :allow-clear="item.clearable || true"
          :picker="item.isMonthPicker ? 'month' : undefined"
          :valueFormat="item.isMonthPicker ? 'YYYY-MM' : 'YYYY-MM-DD'"
          :format="item.isMonthPicker ? 'YYYY-MM' : 'YYYY-MM-DD'" :placeholder="item.placeholder || ['开始日期', '结束日期']" />
        <InputRange v-else-if="item.itemType === 'input-range'" :value="formData[item.prop]" />
      </a-form-item>
      <a-form-item class="queryBtn">
        <div style="display: flex; align-items: center;">
          <a-button type="primary" @click="onSearch" style="margin-right: 10px;" :icon="h(SearchOutlined)">查询
          </a-button>
          <a-button @click="onReset" :icon="h(RedoOutlined)">重置</a-button>
          <slot name="otherButton"></slot>
        </div>
      </a-form-item>
    </a-flex>
  </a-form>

</template>

<script setup lang="ts">
import { ref, inject, h } from 'vue';
import { SearchOutlined, RedoOutlined } from '@ant-design/icons-vue';
import InputRange from '../InputRange/index.vue'
import { log } from 'console';

const formRef = ref();

const configs: any = inject('configs');
const span: any = inject('span');
const formData: any = inject('formData');

const props = defineProps({
  defaultValues: {
    type: Object,
    default: () => ({})
  },
  labelCol: {
    type: Object,
    default: () => ({ style: { width: '150px' } })
  }
});

const emit = defineEmits(['onSearch', 'setValue', 'onReset']);

const onSearch = () => {
  emit('onSearch');
};

const onReset = () => {
  formRef.value.resetFields();

  // 重置 formData 中所有字段为初始值
  Object.keys(formData).forEach(key => {
    if (props.defaultValues[key] !== undefined) {
      formData[key] = props.defaultValues[key]; // 使用传入的默认值
    } else if (Array.isArray(formData[key])) {
      formData[key] = [];
    } else if (typeof formData[key] === 'string') {
      formData[key] = '';
    } else if (typeof formData[key] === 'number') {
      formData[key] = undefined;
    }
  });

  emit('onReset');
};

const focus = async (url: any, index: number) => {
  if (url) {  // 条件判断
    const res = await url();
    configs[index].options = res;
  }
}
</script>

<style lang="scss" scoped>
.flex_box {
  justify-content: flex-end;
}

.el-button--small {
  margin-left: 10px;
}

.no-border {
  display: inline-block;
  border: none;
  padding: 9px 15px;
  margin-left: 10px;
  color: #409eff;
  font-size: 12px;
}

// :deep(.ant-row) {
//   width: 100%;
// }

// :deep(.ant-col) {
//   width: 100%;
// }

:deep(.ant-select) {
  width: 200px;
}

// :deep(.ant-picker) {
//   width: 100%;
// }

:deep(.ant-form-item) {
  margin: 0;
  margin-bottom: 10px;
}

:deep(.ant-form-item-label) {
  padding: 0;
}
</style>
