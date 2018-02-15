//alert("qui ci metto tutto quello che serve per react")
$( document ).ready(function() {

	class Title extends React.Component {
		render () {
			return (
				<h1>GitLens</h1>
				)
		}
	}

	class Message extends React.Component {
		render () {
			return this.props.children
		}
	}

	class ReloadButton extends React.Component {
		render () {
			return (
				<button onClick={loadData}>reload</button>
				)
		}
	}

	function loadData(){
		updateStatus();
		myLoadAreas();
	}

	class Header extends React.Component {
		render () {
			return (
				<div className="header-entry">
					<div className="area-title">Working copy</div>
					<div className="area-title">Staging Area</div>
					<div className="rea-title">HEAD commit</div>
				</div>
				)
		}
	}

	ReactDOM.render(
		<div>
			<Title />
			<Message>Welcome to GitLens</Message>
		</div>,
		document.getElementById('title')
		);

	ReactDOM.render(
		<ReloadButton />,
		document.getElementById('reload')
		);

	ReactDOM.render(
		<Header />,
		document.getElementById('header')
		);

}
)