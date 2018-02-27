const Header = React.createClass({
		render() {
			return (
				<div className={this.props.classNameDivAreas}>
					<div className={this.props.classNameSingleAreas}>{this.props.titleArea1}</div>
					<div className={this.props.classNameSingleAreas}>{this.props.titleArea2}</div>
					<div className={this.props.classNameSingleAreas}>{this.props.titleArea3}</div>
				</div>
				)
		}
});