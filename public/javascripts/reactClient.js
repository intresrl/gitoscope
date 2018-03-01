//qui ci metto tutto quello che serve per react

$( document ).ready(function() {

	const GitLens = GL.GitLens;

	function renderGitLens() {
		ReactDOM.render(
		<GitLens />,
		document.getElementById('GitLens')
		);
	}

	renderGitLens();

}
)
