(function() {
	const Row = Gitoscope.Row;
	
	window.Gitoscope.Table = React.createClass({
			propTypes: {
				rows: React.PropTypes.array.isRequired
			},

			render() {
				return (
					<div>
						<div>
							{ /*The key prop give to Row components a stable identity*/ }
							{this.props.rows.map(row => <Row key={'key-'+row.record} name={row.record} properties={row.status} />)}
						</div>
					</div>
				);
			}
	});
})()
