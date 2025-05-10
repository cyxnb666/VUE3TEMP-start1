<template>
  <div class="table_layout_container">
    <div class="table_form">
      <QueryForm @onSearch="onSearch" v-if="state.showQuery" :defaultValues="defaultValues"
        :labelCol="tableData.labelCol">
        <template #otherButton>
          <slot name="otherButton"></slot>
        </template>
      </QueryForm>
    </div>
    <div class="table_body_wrap">
      <div class="table-content">
        <a-table :dataSource="tableData.dataSource" :columns="tableData.columns" :loading="tableData.loading"
          :row-selection="tableData.rowSelection" :row-key="tableData.rowKey" :pagination="tableData.pagination"
          @change="tableChange" @resizeColumn="handleResizeColumn" :scroll="{ y: state.tableHeight - 55 }"
          style="height: 100%;">
          <template #bodyCell="{ column, record }">
            <slot v-if="column.key === 'operator'" name="operator" :record="record" />
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject, onBeforeUnmount, onMounted, reactive, nextTick, provide } from "vue";
import QueryForm from "./queryForm.vue";

provide('span', 6);
const tableData: any = inject('tableData');
const emit = defineEmits(['tableChange', 'onSearch', 'setValue', 'onReset']);
const tableChange = (pagination: any, filters: any, sorter: any) => {
  if (tableData.pagination.showTotal) {
    pagination.showTotal = tableData.pagination.showTotal;
  }
  emit('tableChange', pagination, filters, sorter);
}

defineProps({
  defaultValues: {
    type: Object,
    default: () => ({})
  }
});

interface stateType {
  tableHeight: number,
  showQuery: boolean
}

const state = reactive(<stateType>{
  tableHeight: 200,
  showQuery: true
});
const onSearch = () => {
  emit('onSearch', true);
}
const setTableHeight = async () => {
  await nextTick();
  const tableLayoutContainer = document.querySelector('.table_layout_container');
  const tableForm = document.querySelector('.table_form');
  const tableBodyWrapDom = document.querySelector('.table_body_wrap');

  if (tableLayoutContainer && tableForm && tableBodyWrapDom) {
    // 获取整个容器的高度
    const tableLayoutHeight = tableLayoutContainer.clientHeight;
    const tableFormHeight = tableForm.clientHeight;
    tableBodyWrapDom.style.height = `${tableLayoutHeight - tableFormHeight - 20}px`;
    state.tableHeight = tableLayoutHeight - tableFormHeight - 20;

    setTimeout(() => {
      const tableBody = document.querySelector('.ant-table-body');
      if (tableBody) {
        // 设置最小高度，表格即使没有数据也能撑满空间
        tableBody.style.minHeight = `${state.tableHeight - 55}px`;
      }
    }, 0);
  }
}
const handleResizeColumn = (w: number, column: any) => {
  column.width = w;
};
const updateTableHeight = () => {
  setTableHeight()
}
defineExpose({
  updateTableHeight
})
onMounted(() => {
  window.addEventListener('resize', setTableHeight);
  setTableHeight();
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', setTableHeight);
})
</script>

<style lang="scss" scoped>
.table_layout_container {
  height: 100%;
  width: 100%;

  .table_form {
    margin-bottom: 10px;
  }

  .table-content {
    height: 100%;
  }
}

:deep(.ant-pagination) {
  // margin: 20px 0 0 0 !important;
}

:deep(.ant-table-wrapper .ant-table-pagination.ant-pagination) {
  margin: 0 !important;
}

:deep(.ant-table-tbody tr) {
  height: 42px;

  .ant-table-cell {
    font-size: 14px;
    padding: 0;
  }
}

:deep(.ant-table-tbody) {
  tr:nth-child(odd) {
    background-color: #F6F7FA;

    .ant-table-cell-fix-left,
    .ant-table-cell-fix-right {
      background-color: #F6F7FA;
    }
  }

  tr:nth-child(even) {
    background-color: #FFFFFF;

    .ant-table-cell-fix-left,
    .ant-table-cell-fix-right {
      background-color: #FFFFFF;
    }
  }
}

:deep(.ant-table-thead tr) {
  height: 42px;

  .ant-table-cell {
    background-color: #F6F7FA;
    font-size: 14px;
    padding: 0;
  }
}

:deep(.ant-table-tbody tr) {
  background-color: #F6F7FA;

  .ant-table-cell-fix-left,
  .ant-table-cell-fix-right {
    background-color: #F6F7FA;
  }
}
</style>
