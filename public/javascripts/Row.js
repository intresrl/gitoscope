const Row = React.createClass({
		location() {
			location.hash = this.props.name;
		},

		render() {
			return (
				<div className="entry" onClick={this.location}>
					<div id="block" className="entry-cell entry-area work">{isInWork(this.props.properties) ? this.props.name : ''}</div>
					<div id="block" className="entry-cell diff">{diff(this.props.properties)}</div>
					<div id="block" className="entry-cell entry-area cache">{isInCache(this.props.properties) ? this.props.name : ''}</div>
					<div id="block" className="entry-cell diffcached">{diffCached(this.props.properties)}</div>
					<div id="block" className="entry-cell entry-area tree">{isInTree(this.props.properties) ? this.props.name : ''}</div>
				</div>
			);
		}
});