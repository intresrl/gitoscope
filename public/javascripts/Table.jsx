(function() {
	const Row = Gitoscope.Row;
    const Header = Gitoscope.Header;

	window.Gitoscope.Table = React.createClass({
			propTypes: {
				rows: React.PropTypes.array.isRequired
			},

			render() {
				return (
                    <div>
						<Header classNameDivAreas="header-entry" classNameSingleAreas="area-title" titleArea1="Working copy" titleArea2="Staging Area" titleArea3="HEAD commit" />
                        <div>
                            <div>
                                {this.props.rows.map(row => <Row key={'key-'+row.record} name={row.record} properties={row.status} />)}
                            </div>
                        </div>
                    </div>
				);
			}
	});
})();
