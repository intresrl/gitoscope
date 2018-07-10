(function(){
	const isInWork = GL.utilities.isInWork;
	const isInCache = GL.utilities.isInCache;
	const isInTree = GL.utilities.isInTree;
	const diff = GL.utilities.diff;
	const diffCached = GL.utilities.diffCached;
	
	window.GL.Row = React.createClass({
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
