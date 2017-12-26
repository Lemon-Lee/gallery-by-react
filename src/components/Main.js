require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

/*let yeomanImage = require('../images/yeoman.png');*/
let imageDatas = require('../data/imageDatas.json');

imageDatas = (imageDatas) => {
	for (let img of imageDatas) {
		let singleImageData = img;
		singleImageData.imageURL = require('../images' + singleImageData.filename);
		img = singleImageData;
	}
	return imageDatas;
}



class AppComponent extends React.Component {
	render() {
		return (
			<section className="stage">
				<section className="img-sec">
				</section>
				<nav className="controller-nav">
				</nav>
			</section>
		);
	}
}

AppComponent.defaultProps = {};

export default AppComponent;