(function() {
	const Row = GL.Row;
	window.GL.Table = React.createClass({
			propTypes: {
				rows: React.PropTypes.array.isRequired
			},

			render() {
				return (
					<div>
						<div>
							{this.props.rows.map(row => <Row key={'key-'+row.record} name={row.record} properties={row.status} />)}
						</div>
					</div>
				);
			}
	});
})()
