(function(){
	const isInWork = Gitoscope.utilities.isInWork;
	const isInCache = Gitoscope.utilities.isInCache;
	const isInTree = Gitoscope.utilities.isInTree;
	const diff = Gitoscope.utilities.diff;
	const diffCached = Gitoscope.utilities.diffCached;
	
	window.Gitoscope.Row = React.createClass({
			location() {
				//Return the anchor part of a URL
				location.hash = this.props.name;
			},

			render() {
				return (
					<div className="entry" onClick={this.location}>
						<div id="block1" className="entry-cell entry-area work">{isInWork(this.props.properties) ? this.props.name : ''}</div>
						<div id="block2" className="entry-cell diff">{diff(this.props.properties)}</div>
						<div id="block3" className="entry-cell entry-area cache">{isInCache(this.props.properties) ? this.props.name : ''}</div>
						<div id="block4" className="entry-cell diffcached">{diffCached(this.props.properties)}</div>
						<div id="block5" className="entry-cell entry-area tree">{isInTree(this.props.properties) ? this.props.name : ''}</div>
					</div>
				);
			}
	});
})()
