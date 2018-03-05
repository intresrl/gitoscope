//Make the function available after the DOM has been loaded.
$( document ).ready(function() {

	function renderGitLens() {
		const GitLens = GL.GitLens;

		ReactDOM.render(
		<GitLens />,
		document.getElementById('GitLens')
		);
	}

	renderGitLens();

}
)
