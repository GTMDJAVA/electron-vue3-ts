模板
<script setup lang="ts">
import {computed, Ref, ref} from 'vue';

/**
 * 定义按钮
 */

interface ButtonConfig {
	text: string;// 按钮文本
	textColor: string;// 按钮文本颜色
	backgroundColor: string;// 按钮背景颜色
	onClick: (text: string, isOperator: boolean) => void;// 点击按钮时的回调函数
	// mouseenter: () => void;// 鼠标进入时的回调函数
	// mouseleave: () => void;// 鼠标离开时的回调函数
	isOperator: boolean;// 是否为运算符
}

const buttons: Array<Array<ButtonConfig>> = [
	[
		{
			text: "%",
			textColor: "black",
			backgroundColor: "#f8f9fd",
			onClick: (text) => percentSignOpr(text),
			isOperator: false,
		},
		{
			text: "CE",
			textColor: "black",
			backgroundColor: "#f8f9fd",
			onClick: () => ceOpr(),
			isOperator: false,
		},
		{
			text: "C",
			textColor: "black",
			backgroundColor: "#f8f9fd",
			onClick: () => clear(),
			isOperator: false,
		},
		{
			text: "←",
			textColor: "black",
			backgroundColor: "#f8f9fd",
			onClick: () => backspace(),
			isOperator: false,
		}
	],
	[
		{
			text: "⅟",
			textColor: "black",
			backgroundColor: "#f8f9fd",
			onClick: (text) => inverseProportional(text),
			isOperator: false,
		},
		{
			text: "x²",
			textColor: "black",
			backgroundColor: "#f8f9fd",
			onClick: (text) => square(text),
			isOperator: false,
		},
		{
			text: "√",
			textColor: "black",
			backgroundColor: "#f8f9fd",
			onClick: (text) => squareRoot(text),
			isOperator: false,
		},
		{
			text: "÷",
			textColor: "black",
			backgroundColor: "#f8f9fd",
			onClick: (text, isOperator) => setOperation(text, isOperator),
			isOperator: true
		}
	],
	[
		{
			text: "7",
			textColor: "black",
			backgroundColor: "#FFFFFF",
			onClick: (text: string) => appendToCurrent(text),
			isOperator: false,
		},
		{
			text: "8",
			textColor: "black",
			backgroundColor: "#FFFFFF",
			onClick: (text) => appendToCurrent(text),
			isOperator: false,
		},
		{
			text: "9",
			textColor: "black",
			backgroundColor: "#FFFFFF",
			onClick: (text) => appendToCurrent(text),
			isOperator: false,
		},
		{
			text: "×",
			textColor: "black",
			backgroundColor: "#f8f9fd",
			onClick: (text, isOperator) => setOperation(text, isOperator),
			isOperator: true
		}
	],
	[
		{
			text: "4",
			textColor: "black",
			backgroundColor: "#FFFFFF",
			onClick: (text) => appendToCurrent(text),
			isOperator: false,
		}, {
		text: "5",
		textColor: "black",
		backgroundColor: "#FFFFFF",
		onClick: (text) => appendToCurrent(text),
		isOperator: false,
	}, {
		text: "6",
		textColor: "black",
		backgroundColor: "#FFFFFF",
		onClick: (text) => appendToCurrent(text),
		isOperator: false,
	}, {
		text: "-",
		textColor: "black",
		backgroundColor: "#f8f9fd",
		onClick: (text, isOperator) => setOperation(text, isOperator),
		isOperator: true
	}
	],
	[
		{
			text: "1",
			textColor: "black",
			backgroundColor: "#FFFFFF",
			onClick: (text) => appendToCurrent(text),
			isOperator: false,
		}, {
		text: "2",
		textColor: "black",
		backgroundColor: "#FFFFFF",
		onClick: (text) => appendToCurrent(text),
		isOperator: false,
	}, {
		text: "3",
		textColor: "black",
		backgroundColor: "#FFFFFF",
		onClick: (text) => appendToCurrent(text),
		isOperator: false,
	}, {
		text: "+",
		textColor: "black",
		backgroundColor: "#f8f9fd",
		onClick: (text, isOperator) => setOperation(text, isOperator),
		isOperator: true,
	}
	],
	[
		{
			text: "∓",
			textColor: "black",
			backgroundColor: "#FFFFFF",
			onClick: () => minusSign(),
			isOperator: false,
		},
		{
			text: "0",
			textColor: "black",
			backgroundColor: "#FFFFFF",
			onClick: (text) => appendToCurrent(text),
			isOperator: false,
		},
		{
			text: ".",
			textColor: "black",
			backgroundColor: "#FFFFFF",
			onClick: (text) => appendToCurrent(text),
			isOperator: false,
		},
		{
			text: "=",
			textColor: "#FFFFFF",
			backgroundColor: "#0067C0",
			onClick: (text) => enterOpr(text),
			isOperator: false,
		}
	]
]

// 当前输入框的内容
const currentInput = ref('');
// 上一次输入框的内容
const previousInput = ref('');

// 上一次输入类型
enum OperationType {
	Number,// 数字
	Operation,// 运算符
	Clear,// 清空
	Enter,// 确认
	Minus,// 负号
}

const previousOperation = ref(OperationType.Number);
// 当前选择的操作
const operation = ref('');
// 当前运算步骤
const calculateResult = ref("");
//历史计算记录
const history = ref<string[]>([]);

/**
 * 将数字追加到当前输入框中。
 * @param number 要追加的数字。
 */
function appendToCurrent(number: string) {
	if (previousOperation.value === OperationType.Operation) {
		currentInput.value = ""; // 清空当前输入框
	}
	if (previousOperation.value === OperationType.Enter) {
		clearTheCurrentInputBox();
		clearTheCalculateResultBox();
	}
	previousOperation.value = OperationType.Number;
	if (currentInput.value.length * displayFontSize.value > 25) {
		displayFontSize.value = displayFontSize.value - 0.3
	}
	currentInput.value += number.toString();// 将数字添加到当前输入框中
}

/**
 * 设置当前操作。
 * @param op 操作符。
 * @param isOperator 是否为运算符。
 */
function setOperation(op: string, isOperator: boolean) {
	if (previousOperation.value === OperationType.Operation) {
		return
	}
	if (previousOperation.value === OperationType.Number) {
		calculateResult.value += currentInput.value;// 将数字添加到计算结果中
		calculate();
	}
	if (previousOperation.value === OperationType.Enter) {
		calculateResult.value = currentInput.value;
	}
	previousOperation.value = OperationType.Operation;
	if (isOperator) {
		operation.value = op;// 保存操作符
		previousInput.value = currentInput.value; // 保存当前输入为上一次输入
		calculateResult.value += op;// 将操作符添加到计算结果中
	}
}

/**
 * 清除当前输入框的内容。
 */
function clearTheCurrentInputBox() {
	currentInput.value = "";
}

/**
 * 清除先前的输入框内容
 */
function clearThePreviousInputBox() {
	previousInput.value = ""; // 清空先前的输入框
}

/**
 * 重置计算结果框
 */
function clearTheCalculateResultBox() {
	calculateResult.value = ""; // 清空计算结果
}

/**
 * 清除所有输入和操作。
 */
function clear() {
	clearTheCurrentInputBox();
	clearThePreviousInputBox();
	operation.value = "";
	clearTheCalculateResultBox();
}

/**
 * 执行计算。
 */
function calculate() {
	let result: number = 0;
	if (!previousInput.value) {
		return
	}
	const prev = parseFloat(previousInput.value); // 转换上一次输入为浮点数
	const current = parseFloat(currentInput.value); // 转换当前输入为浮点数
	// 根据选择的操作执行计算
	switch (operation.value) {
		case '+':
			result = prev + current;
			break;
		case '-':
			result = prev - current;
			break;
		case '×':
			result = prev * current;
			break;
		case '÷':
			result = prev / current;
			break;
	}
	currentInput.value = result.toString(); // 将计算结果显示在当前输入框
	operation.value = ''; // 清空操作
	previousInput.value = ''; // 清空上一次输入
	history.value.push(calculateResult.value)
}

/**
 * 处理按下回车键的操作。
 * 该函数会将当前输入的文字加入计算结果中，并执行计算。
 *
 * @param text {string} 需要加入计算结果的文字。
 */
function enterOpr(text: string) {
	if (previousOperation.value === OperationType.Minus) {
		// 将输入的文字添加到计算结果中
		calculateResult.value += text;
		// 设置之前的操作类型为进入（Enter）
		previousOperation.value = OperationType.Enter;
		return
	}
	// 将当前输入值加到计算结果中
	calculateResult.value += currentInput.value;
	// 执行计算
	calculate();
	// 将输入的文字添加到计算结果中
	calculateResult.value += text;
	// 设置之前的操作类型为进入（Enter）
	previousOperation.value = OperationType.Enter;
}


/**
 * 执行清除操作。
 * 该函数检查先前的操作是否为数字操作，如果是，则清除当前输入框的内容并保留之前计算的结果。
 * 注意：此函数不接受参数，也不返回任何值。
 */
function ceOpr() {
	// 检查之前的操作是否为数字操作，如果不是，则不执行任何操作
	if (previousOperation.value !== OperationType.Number) {
		return;
	}
	// 将当前计算结果更新为保留之前计算结果并删除当前输入的内容
	calculateResult.value = calculateResult.value.slice(0, currentInput.value.length + 1);
	// 清除当前输入框的内容
	clearTheCurrentInputBox();
}

/**
 * 反比例函数
 * @param text 用户输入的操作符或数字字符串。
 */
function inverseProportional(text: string) {
	// 检查之前的操作是否为数字操作，如果不是，则不执行任何操作
	if (previousOperation.value !== OperationType.Number) {
		return;
	}
	currentInput.value = (1 / parseFloat(currentInput.value)).toString();
	// 设置当前操作，并标记为百分比操作
	setOperation(text, true)
	// 在计算结果中添加等号
	calculateResult.value += "="
	// 清除之前的输入框内容
	clearThePreviousInputBox()
	// 设置之前的操作类型为进入（Enter）
	previousOperation.value = OperationType.Enter
}

/**
 * 计算给定数值的平方并更新显示
 * @param text 要显示的操作符或文本（例如："x^2"）
 */
function square(text: string) {
	// 检查之前的操作是否为数字操作，如果不是，则不执行任何操作
	if (previousOperation.value !== OperationType.Number) {
		return;
	}
	currentInput.value = (parseFloat(currentInput.value) * parseFloat(currentInput.value)).toString();
	// 设置当前操作，并标记为百分比操作
	setOperation(text, true)
	// 在计算结果中添加等号
	calculateResult.value += "="
	// 清除之前的输入框内容
	clearThePreviousInputBox()
	// 设置之前的操作类型为进入（Enter）
	previousOperation.value = OperationType.Enter
}

/**
 * 计算给定文本的平方根并更新当前输入框的值。
 * @param text 要处理的文本，预期为平方根符号"√"。
 */
function squareRoot(text: string) {
	// 检查之前的操作是否为数字操作，如果不是，则不执行任何操作
	if (previousOperation.value !== OperationType.Number) {
		return;
	}
	currentInput.value = (Math.sqrt(parseFloat(currentInput.value))).toString();
	// 设置当前操作，并标记为百分比操作
	setOperation(text, true)
	// 在计算结果中添加等号
	calculateResult.value += "="
	// 清除之前的输入框内容
	clearThePreviousInputBox()
	// 设置之前的操作类型为进入（Enter）
	previousOperation.value = OperationType.Enter
}

/**
 * 将当前输入框的值转换为百分比形式，并执行计算。
 * @param text 用户输入的操作符或数字字符串。
 */
function percentSignOpr(text: string) {
	// 将当前输入值除以100，并转换为字符串
	currentInput.value = (parseFloat(currentInput.value) / 100).toString();
	// 设置当前操作，并标记为百分比操作
	setOperation(text, true)
	// 在计算结果中添加等号
	calculateResult.value += "="
	// 清除之前的输入框内容
	clearThePreviousInputBox()
	// 设置之前的操作类型为进入（Enter）
	previousOperation.value = OperationType.Enter
}

/**
 * backspace 函数用于模拟键盘的退格功能。
 * 该函数检查前一个操作是否为数字操作，如果是，则删除当前输入和计算结果中的最后一个字符。
 */
function backspace() {
	// 检查前一个操作是否为数字类型，如果不是，则不执行任何操作
	if (previousOperation.value !== OperationType.Number) {
		return
	}
	// 删除当前输入中的最后一个字符
	currentInput.value = currentInput.value.slice(0, -1);
	// 删除计算结果中的最后一个字符
	calculateResult.value = calculateResult.value.slice(0, -1);
}

/**
 * 函数minusSign用于执行负号操作。
 * 该函数不接受参数，也不直接返回值，但会更新当前输入值(currentInput.value)、
 * 上一次操作类型(previousOperation.value)和计算结果(calculateResult.value)。
 */
function minusSign() {
	// 当前输入框为空时，不执行任何操作
	if (currentInput.value === "") {
		return
	}
	// 设置上一次操作类型为负号
	previousOperation.value = OperationType.Minus
	// 将当前输入值转换为浮点数，执行减法操作，并将结果转换为字符串后更新当前输入值
	currentInput.value = (0 - parseFloat(currentInput.value)).toString();
	// 同时将计算结果更新为当前输入值
	calculateResult.value = currentInput.value;
}

/**
 * 初始化并管理历史记录显示的字体大小。
 * @type {Ref<number>}
 */
const historyDisplayFontSize = ref(1)
/**
 * 根据字体大小调整历史记录的显示样式。
 * 该计算属性基于`historyDisplayFontSize`的值来动态计算样式对象。
 * @returns {Object} 返回一个包含样式的对象，用于设置历史记录的显示样式。
 */
const historyDisplayStyle = computed(() => ({
	display: 'flex', // 使用弹性布局显示历史记录
	justifyContent: 'flex-end', // 使内容右对齐
	alignItems: 'flex-end', // 使内容底部对齐
	fontSize: historyDisplayFontSize.value + 'em', // 根据字体大小设置字体大小
}))

/**
 * 初始化并管理显示文本的字体大小。
 * - 通过 `ref` 创建一个响应式变量，初始值为 2.3。
 * @type {Ref<number>}
 */
const displayFontSize = ref(2.3)
/**
 * 根据 `displayFontSize` 计算并返回相应的样式对象。
 * - 使用 `computed` 来创建一个响应式计算属性，根据 `displayFontSize` 的值动态计算字体大小。
 * @returns {Object} 返回包含 fontSize 属性的样式对象。
 */
const displayStyle = computed(() => ({
	fontSize: displayFontSize.value + 'em', // 将字体大小设置为 `displayFontSize` 指定的值，并单位为 `em`
}))

/**
 * 编辑元素的背景透明度
 * @param event 鼠标事件，用于获取触发该函数的元素
 * @param opacity 要设置的背景透明度，范围为0到1
 */
function editBackgroundOpacity(event: MouseEvent, opacity: number) {
	const target = event.target as HTMLElement; // 获取触发事件的元素
	const backgroundColor = target.style.backgroundColor; // 获取当前元素的背景颜色

	// 尝试将背景颜色匹配为RGBA格式，以便可以编辑透明度
	const rgbaColor = backgroundColor.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
	if (rgbaColor) {
		// 如果匹配成功，解构匹配到的颜色值
		const [_, r, g, b, a] = rgbaColor;
		// 使用新的透明度值设置背景颜色
		target.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
	}
}

</script>

<template>
	<div class="calculatorBox">
		<div class="calculator">
			<div class="historyDisplay" :style="historyDisplayStyle">{{ calculateResult }}</div>
			<div class="display" :style="displayStyle">{{ currentInput || '0' }}</div>
			<div class="buttonsBox">
				<div class="buttons" v-for="(buttonRow, rowIndex) in buttons" :key="`row-${rowIndex}`">
					<!-- 数字按钮 -->
					<button
							v-for="button in buttonRow"
							:key="button.text"
							class="calculatorButton"
							:style="{ backgroundColor: button.backgroundColor , color: button.textColor}"
							@click="button.onClick(button.text,button.isOperator)"
							@mouseenter="editBackgroundOpacity($event,0.6)"
							@mouseleave="editBackgroundOpacity($event,1)"
					>
						{{ button.text }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.calculatorBox {
	width: 300px;
	border: 1px solid #b0b1b4;
	border-radius: 10px;
	margin: 0 auto;
	overflow: hidden;
}

.calculator {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 5px;
	background-color: #f0f3fa;
}

.display {
	background-color: #f0f3fa;
	width: 100%;
	height: 80px;
	text-align: right;
	margin: auto 0;
	font-size: 2.3em;
	font-weight: bold;
	padding: 10px 10px 20px 10px;
	box-sizing: border-box;
}

.historyDisplay {
	background-color: #f0f3fa;
	width: 100%;
	height: 50px;
	text-align: right;
	margin: auto 0;
	box-sizing: border-box;
	white-space: pre-wrap; /* 保留空白符，允许自动换行 */
	word-break: break-word; /* 在长单词或URL地址内部进行换行 */
}

.buttons {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 5px;
	width: 100%;
}

.buttonsBox {
	display: grid;
	grid-template-columns: repeat(1, 1fr);
	gap: 5px;
	width: 100%;
}

.calculatorButton {
	padding: 10px 20px;
	font-size: 1em;
	font-weight: 500;
	border: 1px solid #e3e5eb;
	background-color: #FFFFFF;
}

/* 可以添加更多样式以提高视觉外观 */
</style>
