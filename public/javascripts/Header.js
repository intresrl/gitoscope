const Header = React.createClass({
		render() {
			return (
				<div className={this.props.classNameDivAreas}>
					<div className={this.props.classNameSingleAreas}><p className="lead">{this.props.titleArea1}</p></div>
					<div className={this.props.classNameSingleAreas}><p className="lead">{this.props.titleArea2}</p></div>
					<div className={this.props.classNameSingleAreas}><p className="lead">{this.props.titleArea3}</p></div>
				</div>
				)
		}
});