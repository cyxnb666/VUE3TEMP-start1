<template>
  <div class="dashboard-container">
    <a-row :gutter="16">
      <a-col :span="24">
        <a-card title="视频预览" :bordered="false">
          <!-- Video player will be displayed here -->
          <div v-if="loading">加载中...</div>
          <div v-else-if="error">{{ error }}</div>
          <video 
            v-else-if="videoUrl" 
            controls 
            style="max-width: 100%;"
            :src="videoUrl"
          ></video>
        </a-card>
      </a-col>
    </a-row>

    <!-- Keep the original content -->
    <a-divider />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { getFilePreview } from './api';


// Video state
const videoUrl = ref<string>('');
const loading = ref<boolean>(false);
const error = ref<string>('');

// Fetch and display the video
const fetchVideo = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    // Use the provided file key
    const response = await getFilePreview('1911608101312794624.mp4');
    
    // Create a blob from the response
    const blob = new Blob([response], { type: 'video/mp4' });
    
    // Create a URL for the blob
    videoUrl.value = URL.createObjectURL(blob);
  } catch (err) {
    console.error('Failed to load video:', err);
    error.value = '视频加载失败，请稍后再试';
  } finally {
    loading.value = false;
  }
};

// Clean up resources when component is destroyed
onBeforeUnmount(() => {
  if (videoUrl.value) {
    URL.revokeObjectURL(videoUrl.value);
  }
});

// Fetch video when component is mounted
onMounted(() => {
  fetchVideo();
});
</script>

<style scoped>
.dashboard-container {
    padding: 24px;
}

:deep(.ant-card) {
    margin-bottom: 16px;
}
</style>