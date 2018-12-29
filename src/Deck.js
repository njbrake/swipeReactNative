import React from 'react';
import {
	StyleSheet,
	View,
	Animated,
	PanResponder,
	Dimensions,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;
class Deck extends React.Component {
	constructor(props) {
		super(props);
		const position = new Animated.ValueXY();
		const panResponder = PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onPanResponderMove: (e, gesture) => {
				console.log(gesture);
				position.setValue({ x: gesture.dx, y: gesture.dy });
			},
			onPanResponderRelease: () => {
				this.resetPosition();
			},
		});
		this.state = {
			panResponder,
			position,
		};
	}

	resetPosition() {
		Animated.spring(this.state.position, {
			toValue: { x: 0, y: 0 },
		}).start();
	}
	getCardStyle() {
		const { position } = this.state;
		const rotate = position.x.interpolate({
			inputRange: [-screenWidth * 1.5, 0, screenWidth * 1.5],
			outputRange: ['-120deg', '0deg', '120deg'],
		});
		return {
			...position.getLayout(),
			transform: [{ rotate }],
		};
	}

	renderCards() {
		return this.props.data.map((item, index) => {
			if (index === 0) {
				return (
					<Animated.View
						key={index}
						style={this.getCardStyle()}
						{...this.state.panResponder.panHandlers}
					>
						{this.props.renderCard(item)}
					</Animated.View>
				);
			}
			return this.props.renderCard(item);
		});
	}
	render() {
		return <Animated.View>{this.renderCards()}</Animated.View>;
	}
}

export default Deck;
