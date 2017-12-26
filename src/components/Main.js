require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ReactDOM from 'react-dom';

/*let yeomanImage = require('../images/yeoman.png');*/
let imageDatas = require('../data/imageDatas.json');

imageDatas = (function() {
	for (let img of imageDatas) {
		img.imageURL = require('../images/' + img.fileName);
	}
	return imageDatas;
})(imageDatas);

class ImgFigureComponent extends React.Component {
	handleClick(e) {
		if (this.props.arrange.isCenter) {
			this.props.inverse();
		} else {
			this.props.center();
		}
		e.stopPropagation();
		e.preventDefault();
	}
	render() {
		let styleObj = {};
		if (this.props.arrange.pos) {
			styleObj = this.props.arrange.pos;
		}
		if (this.props.arrange.rotate) {
			(['Moz', 'ms', 'Webkit', '']).forEach(function(value) {
				styleObj[value + 'Transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
			}.bind(this));

		}
		if (this.props.arrange.isCenter) {
			styleObj.zIndex = 11;
		}
		let imgFigureClass = 'img-figure';
		imgFigureClass += this.props.arrange.isInverse ? ' is-inverse' : '';
		return (
			<figure className={imgFigureClass} style={styleObj} onClick={this.handleClick.bind(this)}>
		<img src={this.props.data.imageURL} alt={this.props.data.title}/>
				<figcaption>
					<h2 className='img-title'>{this.props.data.title}</h2>
					<div className="img-back" onClick={this.handleClick.bind(this)}>
						<p>{this.props.data.desc}
						</p>
					</div>
				</figcaption>
			</figure>
		);
	}
}

/*
 *获取区间内的一个随机值
 */
function getRangeRandom(low, high) {
	return Math.ceil(Math.random() * (high - low) + low);
}
/*
 *获取0~30度之间的一个任意正负值
 */
function get30DegRandom() {
	return (Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30);
}

class AppComponent extends React.Component {
		const = {
			centerPos: {
				left: 0,
				right: 0
			},
			hPosRange: {
				leftSecX: [0, 0],
				rightSecX: [0, 0],
				y: [0, 0]
			},
			vPosRange: {
				x: [0, 0],
				topY: [0, 0]
			}
		}

		state = {
			imgsArrangeArr: [
				/*{
					pos:{
						left:'0',
						top:'0'
					},
					rotate:0,
					isInverse:false, //图片正反面
					isCenter:false, //图片是否居中
				}*/
			]
		}

		inverse(index) {
			return function() {
				let imgsArrangeArr = this.state.imgsArrangeArr;
				imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
				this.setState({
					imgsArrangeArr: imgsArrangeArr
				});
			}.bind(this);
		}
		/*
		 *利用rearrange函数 居中对应的index图片
		 *@param index
		 *@return {function}
		 */
		center(index) {
			return function() {
				this.rearrange(index);
			}.bind(this);
		}
		/*
		 *重新布局所有图片
		 *@params
		 */
		rearrange(centerIndex) {
			let imgsArrangeArr = this.state.imgsArrangeArr,
				centerPos = this.const.centerPos,
				hPosRange = this.const.hPosRange,
				vPosRange = this.const.vPosRange,
				hPosRangeLeftSecX = hPosRange.leftSecX,
				hPosRangeRightSecX = hPosRange.rightSecX,
				hPosRangeY = hPosRange.y,
				vPosRangeTopY = vPosRange.topY,
				vPosRangeX = vPosRange.x,
				imgsArrangeTopArr = [],
				topImgNum = Math.ceil(Math.random() * 2),
				topImgSpliceIndex = 0,
				imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

			/*//首先居中centerIndex的图片
			imgsArrangeCenterArr[0].pos = centerPos;

			//居中的图片不需要旋转
			imgsArrangeCenterArr[0].rotate = 0;*/
			imgsArrangeCenterArr[0] = {
				pos: centerPos,
				rotate: 0,
				isCenter: true

			}

			//取出要布局上册的图片的状态信息
			topImgSpliceIndex = Math.ceil(Math.random(imgsArrangeArr.length - topImgNum));
			imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);
			//布局位于上侧的图片
			imgsArrangeTopArr.forEach((value, index) => {
				imgsArrangeTopArr[index] = {
					pos: {
						top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
						left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
					},
					rotate: get30DegRandom(),
					isCenter: false
				}
			});
			for (let i = 0; i < imgsArrangeArr.length; i++) {
				let hPosRangeLORX = null;
				let j = imgsArrangeArr.length;
				if (i < j / 2) {
					hPosRangeLORX = hPosRangeLeftSecX
				} else {
					hPosRangeLORX = hPosRangeRightSecX;
				}
				imgsArrangeArr[i] = {
					pos: {
						top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
						left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
					},
					rotate: get30DegRandom(),
					isCenter: false
				}
			}
			if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
				imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
			}
			imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
			this.setState({
				imgsArrangeArr: imgsArrangeArr
			});
		}
		//组件加载后，为每张图片计算图片范围
		componentDidMount() {
			let stageDom = ReactDOM.findDOMNode(this.refs.stage),
				stageW = stageDom.scrollWidth,
				stageH = stageDom.scrollHeight,
				halfStageW = Math.ceil(stageW / 2),
				halfStageH = Math.ceil(stageH / 2);
			let imgFigureDOM = ReactDOM.findDOMNode(this.refs.image0),
				imgW = imgFigureDOM.scrollWidth,
				imgH = imgFigureDOM.scrollHeight,
				halfImgW = Math.ceil(imgW / 2),
				halfImgH = Math.ceil(imgH / 2);
			this.const.centerPos = {
				left: halfStageW - halfImgW,
				top: halfStageH - halfImgH
			}
			this.const.hPosRange.leftSecX[0] = -halfImgW;
			this.const.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;

			this.const.hPosRange.rightSecX[0] = halfStageW + halfImgW;
			this.const.hPosRange.rightSecX[1] = stageW - halfImgW;
			this.const.hPosRange.y[0] = -halfImgW;
			this.const.hPosRange.y[1] = stageH - halfImgH;

			this.const.vPosRange.topY[0] = -halfImgH;
			this.const.vPosRange.topY[1] = halfStageH - halfImgH * 3;
			this.const.vPosRange.x[0] = halfStageW - imgW;
			this.const.vPosRange.x[1] = halfStageW;

			this.rearrange(0);
		}
		render() {
				let controllerUnits = [],
					imgFigures = [],
					that = this;
				imageDatas.forEach(function(value, index) {
							if (!that.state.imgsArrangeArr[index]) {
								that.state.imgsArrangeArr[index] = {
									pos: {
										left: '0',
										top: '0'
									},
									rotate: 0,
									isInverse: false,
									isCenter: false
								}
							}
							imgFigures.push( < ImgFigureComponent data = {
									value
								}
								ref = {
									'image' + index
								}
								arrange = {
									this.state.imgsArrangeArr[index]
								}
								inverse = {
									this.inverse(index)
								}
								center = {
									this.center(index)
								}
								/> );
							}.bind(this));
						return (
								<section className="stage" ref="stage">
		<section className="img-sec" key="test">{imgFigures}</section> <
		nav className = "controller-nav" > {
			controllerUnits
		} < /nav>  < /
		section >
				);
			}
		}

		AppComponent.defaultProps = {};

		export default AppComponent;