<template>
    <div class="dashboard-container">
        <a-row :gutter="16">
            <a-col :span="6" v-for="card in cards" :key="card.title">
                <a-card :title="card.title" :bordered="false">
                    <template #extra><a href="#">更多</a></template>
                    <p>{{ card.value }}</p>
                </a-card>
            </a-col>
        </a-row>

        <a-divider />

        <a-row :gutter="16">
            <a-col :span="12">
                <a-card title="最近活动" :bordered="false">
                    <a-list item-layout="horizontal" :data-source="activities">
                        <template #renderItem="{ item }">
                            <a-list-item>
                                <a-list-item-meta :title="item.title" :description="item.time">
                                    <template #avatar>
                                        <a-avatar :style="{ backgroundColor: item.color }">{{ item.avatar }}</a-avatar>
                                    </template>
                                </a-list-item-meta>
                            </a-list-item>
                        </template>
                    </a-list>
                </a-card>
            </a-col>
            <a-col :span="12">
                <a-card title="快速操作" :bordered="false">
                    <a-button type="primary" style="margin-right: 8px">添加用户</a-button>
                    <a-button style="margin-right: 8px">导出数据</a-button>
                    <a-button>系统设置</a-button>

                    <a-divider />

                    <a-progress :percent="75" status="active" />
                    <div>当前系统资源使用率: 75%</div>
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const cards = ref([
    { title: '总用户数', value: '1,293' },
    { title: '本周活跃用户', value: '758' },
    { title: '系统消息', value: '12' },
    { title: '待处理任务', value: '5' }
]);

const activities = ref([
    { title: '用户张三登录了系统', time: '刚刚', avatar: '张', color: '#1890ff' },
    { title: '新增数据58条', time: '10分钟前', avatar: '新', color: '#52c41a' },
    { title: '系统自动备份完成', time: '30分钟前', avatar: '备', color: '#faad14' },
    { title: '管理员更新了系统配置', time: '1小时前', avatar: '配', color: '#f5222d' }
]);
</script>

<style scoped>
.dashboard-container {
    padding: 24px;
}

:deep(.ant-card) {
    margin-bottom: 16px;
}
</style>