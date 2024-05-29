<div id="ui">
	<div id="uileft">
		<div id="dotsleft">
			- <br /> -----<br /> -----<br /> -----<br />-- <br />- --<br />- - <br />---- -<br />-- ---<br
			/> <br />- -- <br />- - <br />-- ---<br />------<br />-- -<br /> - <br />- -<br />------<br />
			- ---<br />- -<br />- --- <br /> --- <br /> - <br /> -- <br />
			-----<br />------<br /> --- <br /> -<br />------<br /> - --<br />- -- <br /> - ---<br />-- -
			<br />---- -<br />------<br />-- ---<br /> - - <br /> - <br />- - <br /> - <br /> -
			<br />
			--
			<br />- <br /> -----<br /> -----<br /> -----<br />-- <br />- --<br />- - <br />---- -<br />--
			---<br /> <br />- -- <br />- - <br />-- ---<br />------
		</div>
		<div id="dotsright">
			- <br /> -----<br /> -----<br /> -----<br />-- <br />- --<br />- - <br />---- -<br />-- ---<br
			/> <br />- -- <br />- - <br />-- ---<br />------<br />-- -<br /> - <br />- -<br />------<br />
			- ---<br />- -<br />- --- <br /> --- <br /> - <br /> -- <br />
			-----<br />------<br /> --- <br /> -<br />------<br /> - --<br />- -- <br /> - ---<br />-- -
			<br />---- -<br />------<br />-- ---<br /> - - <br /> - <br />- - <br /> - <br /> -
			<br />
			--
			<br />- <br /> -----<br /> -----<br /> -----<br />-- <br />- --<br />- - <br />---- -<br />--
			---<br /> <br />- -- <br />- - <br />-- ---<br />------
		</div>
	</div>
	<div id="uimiddle">
		<div>2.67</div>
		<div>1002</div>
		<div>45.6</div>
		<div>&nbsp;</div>
	</div>
	<div id="uiright">
		<svg id="logo" viewBox="0 0 530 530">
			<path
				fill="#957532"
				d="M320.622,16.038c-48.13-10.56-96.075-6.789-139.409,8.433l205.646,142.285L363.887,29.585 C350.117,23.897,335.676,19.34,320.622,16.038z M381.61,37.721l41.565,244.095l79.798-112.224 C480.031,113.27,437.342,65.91,381.61,37.721z M164.624,30.954C107.809,55.459,60.469,100.197,33.57,158.183l248.56-46.176 L164.624,30.954z M508.526,184.605L367.76,388.57l135.075-25.795c5.425-13.334,9.788-27.293,12.978-41.823l1.161-5.589 C525.838,270.157,522.227,225.371,508.526,184.605z M165.219,149.9L26.793,174.226c-4.543,11.86-8.283,24.22-11.088,37.004 C5.067,259.717,8.992,308.02,24.5,351.609L165.219,149.9z M107.782,257.134L31.555,369.377 c24.248,54.834,67.436,100.631,123.173,127.418L107.782,257.134z M496.049,377.989l-242.225,46.989l111.375,76.992 C421.459,478.19,468.575,434.608,496.049,377.989z M146.782,370.741l23.439,132.869c12.988,5.211,26.556,9.434,40.676,12.53 c47.857,10.5,95.541,6.83,138.681-8.18L146.782,370.741z"
			/>
		</svg>
	</div>
</div>

<style>
	@keyframes dots_down {
		0% {
			transform: translateY(-63%) scaleY(0.5);
		}
		100% {
			transform: translateY(-25.5%) scaleY(0.5);
		}
	}

	@keyframes dots_up {
		0% {
			transform: translateY(-25.5%) scaleY(0.5);
		}
		100% {
			transform: translateY(-63%) scaleY(0.5);
		}
	}

	#ui {
		position: absolute;
		right: 1em;
		line-height: 1;
		cursor: default;
		user-select: none;
	}
	#ui > div {
		border: 2px solid;
		display: inline-block;
		font-size: 22px;
		transform: translateY(-0.5em);
		vertical-align: top;
		height: 120px;
		box-sizing: border-box;
		line-height: 1.3;
	}
	#uiright {
		width: 120px;
		padding: 7px;
	}
	#uimiddle {
		padding: 2px;
	}
	#uimiddle::before {
		content: "";
		background-color: #957532;
		position: absolute;
		top: 0.4em;
		left: -0.4em;
		width: 0.4em;
		height: 2px;
	}
	#uimiddle::after {
		content: "";
		background-color: #957532;
		position: absolute;
		top: 0.4em;
		right: -0.4em;
		width: 0.4em;
		height: 2px;
	}
	#uileft {
		width: 240px;
		padding: 2px;
	}
	#logo {
		width: 100%;
		height: 100%;
	}

	#uileft {
		white-space: pre;
		overflow: hidden;
	}
	#uileft > div {
		vertical-align: top;
		transform-origin: 50% 50%;
		font-size: 30px;
		position: absolute;
		line-height: 0.6;
		font-weight: bold;
	}

	#dotsleft {
		left: 0.25em;
		top: 0;
		animation: dots_down 2.5s linear 0s infinite normal;
	}
	#dotsright {
		right: 0.25em;
		top: 0;
		animation: dots_up 2.5s linear 0s infinite normal;
	}
</style>
