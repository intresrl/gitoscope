(function(){
	window.Gitoscope.Row = React.createClass({
			location() {
				location.hash = this.props.name;
			},

			render() {
				return (
					<div className="entry" onClick={this.location}>
						<div id="block1" className="entry-cell entry-area work">{this.props.properties.isInWorkingCopy ? this.props.name : ''}</div>
						<div id="block2" className="entry-cell diff-area diff">{this.props.properties.diffString}</div>
						<div id="block3" className="entry-cell entry-area cache">{this.props.properties.isInCache ? this.props.name : ''}</div>
						<div id="block4" className="entry-cell diff-area diffcached">{this.props.properties.diffCachedString}</div>
						<div id="block5" className="entry-cell entry-area tree">{this.props.properties.isInTree ? this.props.name : ''}</div>
					</div>
				);
			}
	});
})();
