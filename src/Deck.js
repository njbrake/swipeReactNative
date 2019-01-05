import React from 'react';
import {
	StyleSheet,
	View,
	Animated,
	PanResponder,
	Dimensions,
	LayoutAnimation,
	UIManager,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const swipeThreshold = Dimensions.get('window').width / 4;
const swipeOutDuration = 250;

class Deck extends React.Component {
	static defaultProps = {
		onSwipeRight: () => {},
		onSwipeLeft: () => {},
		renderNoMoreCards: () => {},
	};
	constructor(props) {
		super(props);
		const position = new Animated.ValueXY();
		const panResponder = PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onPanResponderMove: (e, gesture) => {
				position.setValue({ x: gesture.dx, y: gesture.dy });
			},
			onPanResponderRelease: (e, gesture) => {
				if (gesture.dx >= swipeThreshold) {
					this.forceSwipeRight();
				} else if (gesture.dx < -swipeThreshold) {
					this.forceSwipeLeft();
				} else {
					this.resetPosition();
				}
			},
		});
		this.state = {
			panResponder,
			position,
			index: 0,
		};
	}

	componentWillUpdate() {
		UIManager.setLayoutAnimationEnabledExperimental &&
			UIMAanager.setLayoutAnimationEnabledExperimental(true);
		LayoutAnimation.spring();
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.data !== this.props.data) {
			this.setState({ index: 0 });
		}
	}
	forceSwipeRight() {
		Animated.timing(this.state.position, {
			toValue: { x: screenWidth, y: 0 },
			duration: swipeOutDuration,
		}).start(() => this.onSwipeComplete('right'));
	}
	forceSwipeLeft() {
		Animated.spring(this.state.position, {
			toValue: { x: -screenWidth, y: 0 },
			duration: swipeOutDuration,
		}).start(() => this.onSwipeComplete('left'));
	}

	onSwipeComplete(direction) {
		const { onSwipeLeft, onSwipeRight, data } = this.props;
		const item = data[this.state.index];
		direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);
		this.state.position.setValue({ x: 0, y: 0 });
		this.setState({ index: this.state.index + 1 });
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
		if (this.state.index >= this.props.data.length) {
			return this.props.renderNoMoreCards();
		}
		return this.props.data
			.map((item, i) => {
				if (i < this.state.index) {
					return null;
				}
				if (i === this.state.index) {
					return (
						<Animated.View
							key={i}
							style={[this.getCardStyle(), styles.card]}
							{...this.state.panResponder.panHandlers}
						>
							{this.props.renderCard(item)}
						</Animated.View>
					);
				}
				return (
					<Animated.View
						key={item.id}
						style={[styles.card, { top: 10 * (i - this.state.index) }]}
					>
						{this.props.renderCard(item)}
					</Animated.View>
				);
			})
			.reverse();
	}
	render() {
		return <Animated.View>{this.renderCards()}</Animated.View>;
	}
}

const styles = {
	card: {
		position: 'absolute',
		width: screenWidth,
	},
};
export default Deck;
