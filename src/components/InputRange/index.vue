<template>
  <div class="InputRange">
    <a-input-number class="inputNumber" v-model:value="startValue" :min="0" :max="99999"
                    @change="inputRangeChange($event,'minPlantArea')"/>
    <div class="partition">-</div>
    <a-input-number class="inputNumber" v-model:value="endValue" :min="0" :max="99999"
                    @change="inputRangeChange($event, 'maxPlantArea')"/>
  </div>

</template>

<script lang="ts" setup>
import {onMounted, ref, toRefs, watch, inject} from "vue";

const inputRangeChange = inject('inputRangeChange');
const props = defineProps<{
  value: Record<number, any>[];
}>();
const {value} = toRefs(props)
watch(
    () => value.value,
    (newValue) => {
      if (newValue && newValue.length) {
        startValue.value = newValue[0]
        endValue.value = newValue[1]
      } else {
        startValue.value = null
        endValue.value = null
      }
    },
    {deep: true}
)
const startValue = ref(null)
const endValue = ref(null)

onMounted(() => {
})
</script>

<style lang="scss" scoped>
.InputRange {
  display: flex;
  align-items: center;

  .partition {
    width: 10px;
    text-align: center;
  }

  .inputNumber {
    width: calc(50% - 5px);
  }
}
</style>
