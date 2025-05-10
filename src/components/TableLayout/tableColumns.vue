<template>
  <a-table
      :bordered="showBorder"
      :dataSource="data"
      :pagination="false"
      :scroll="{ y: height }"
      @rowClick="handleRowClick"
      @rowDoubleClick="handleRowDblclick"
  >
    <a-table-column
        title="序号"
        v-if="showIndex"
        dataIndex="index"
        key="index"
        :width="60"
        align="center"
    />
    <a-table-column
        v-for="item in columns"
        :key="item.prop"
        :dataIndex="item.prop"
        :title="item.label"
        :width="item.width"
        align="center"
    >
      <template #customRender="{ text, record }">
        <slot v-if="item.slot" :name="item.prop" :text="text" :record="record"/>
        <span v-else>{{ text }}</span>
      </template>
    </a-table-column>
    <a-table-column
        v-if="showOperator"
        title="操作"
        align="center"
        :width="operatorWidth"
    >
      <template #bodyCell="{ record }">
        <slot name="operator" :record="record"/>
      </template>
    </a-table-column>
  </a-table>
</template>
<script setup lang="ts">
import {toRefs} from "vue";


type Column = {
  prop: string;
  label: string;
  width?: string;
  minWidth?: string;
  slot?: boolean;
};
const props = defineProps<{
  data: Record<string, any>[];
  columns: Column[];
  showOperator: boolean;
  operatorWidth: number | string;
  showBorder: boolean;
  showIndex: boolean;
  height: string | number;
}>();
const {
  data,
  columns,
  showOperator,
  operatorWidth,
  showBorder,
  showIndex,
  height,
} = toRefs(props);

const emit = defineEmits(['rowClick', 'rowDblclick']);
const handleRowClick = (record: Record<string, any>, index: number) => {
  emit('rowClick', record, index);
};
const handleRowDblclick = (record: Record<string, any>, index: number) => {
  emit('rowDblclick', record, index);
};
</script>

<style lang="scss" scoped></style>
