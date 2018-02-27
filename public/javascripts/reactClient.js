//alert("qui ci metto tutto quello che serve per react")

$( document ).ready(function() {

	function renderGitLens() {
		ReactDOM.render(
		<GitLens />,
		document.getElementById('GitLens')
		);
	}

	renderGitLens();

}
)
