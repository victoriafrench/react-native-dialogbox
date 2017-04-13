'use strict';

import React, { Component, PropTypes } from 'react';
import { View, Text, Dimensions, TouchableWithoutFeedback, PixelRatio, Platform } from 'react-native';
import PopContent from './PopContent';
import styleShape from './style-shape';
import makeStyleProxy from './make-stylesheet';

export default class DisplayPopup extends Component {

	static PropTypes = {
		isOverlay: PropTypes.bool,
		isOverlayClickClose: PropTypes.bool,
		onDismiss: PropTypes.func,
		style: PropTypes.shape(styleShape),
		btns: PropTypes.arrayOf(PropTypes.object)
	}

	static defaultProps = {
		isOverlay: true,
		isOverlayClickClose: true,
		btns: [{
			text: 'ok',
			callback: () => {},
		}],
	};

	constructor(props, context) {
		super(props, context);

		this.state = {
			isVisible: true,
		};

	}

	close = () => {
		this.setState({
			isVisible: false,
		});
	}

	_onOverlayPress = () => {
		const { isOverlayClickClose, onDismiss } = this.props;
		if (isOverlayClickClose) {
			if (onDismiss && typeof onDismiss === 'function') {
				onDismiss();
			}
			this.close();
		}
	}

	_renderOverlay = (styles) => {
		const { isOverlay } = this.props;
		if(isOverlay) {
			return (
				<TouchableWithoutFeedback onPress={this._onOverlayPress}>
					<View style={styles.overlay}></View>
				</TouchableWithoutFeedback>
			);
		}
	}

	render() {
		let { isVisible } = this.state;
		const { title, content, btns, style } = this.props;
		const styles = makeStyleProxy(style, Dimensions, Platform, PixelRatio)();
		const buttons = btns.map((item) => {
			return {
				text: item.text,
				callback: () => {
					typeof item.callback === 'function' && item.callback();
					this.close();
				},
			};
		});
		if(isVisible) {
			return (
				<View style={styles.popupContainer}>
					{this._renderOverlay(style)}
					<View style={styles.tipBoxView}>
						<PopContent title={title} content={content} btns={buttons} style={this.props.style} />
					</View>
				</View>
			);
		}
		return <View style={styles.hidden}/>;
	}

};