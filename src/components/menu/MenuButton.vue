<script setup lang="ts">
import {useRouter} from 'vue-router'
import {defineProps, ref, toRefs} from 'vue';

const router = useRouter()
const hover = ref(false)
const emit = defineEmits(['setActive']);

// 定义接收的属性类型
const props = withDefaults(defineProps<{
	code: string
	url?: string
	content: string
	isSelected: boolean
}>(), {
	url: '/'
})

const {isSelected} = toRefs(props)

const goUrl = () => {
	router.push(props.url);
	emit('setActive', props.code); // 通知父组件激活的项
}

const toggleHover = (value: boolean) => {
	if (value) {
		hover.value = value
	} else if (isSelected) {
		hover.value = value
	}
}


</script>

<template>
	<button type="button" class="menuButton" @click="goUrl" @mouseenter="toggleHover(true)"
	        @mouseleave="toggleHover(false)" :class="{whiteBackground:isSelected||hover}">{{
			content
		}}
	</button>
</template>

<style scoped>
.menuButton {
	width: 100%;
	overflow: hidden;
	margin: 5px 0;
	height: 30px;
	text-align: center;
	padding: 5px 15px;
	background: rgb(222, 233, 248, 0);
	/*  transition: background-color 1s;*/
}

.whiteBackground {
	background-color: #F8F8F8;
}
</style>