import React from 'react';
import { StyleSheet, View, Animated } from 'react-native';

class Ball extends React.Component {
	componentWillMount() {
		this.position = new Animated.ValueXY(0, 0);
		Animated.spring(this.position, { toValue: { x: 200, y: 500 } }).start();
	}
	render() {
		return (
			<Animated.View style={this.position.getLayout()}>
				<View style={styles.container} />
			</Animated.View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		height: 60,
		width: 60,
		borderColor: 'red',
		borderWidth: 30,
		borderRadius: 30,
	},
});

export default Ball;
