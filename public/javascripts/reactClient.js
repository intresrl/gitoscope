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

	function updateStatus(){
	    var treePromise = $.get('/api/tree');
	    var statusPromise = $.get('/api/status');
		$.when(treePromise, statusPromise).then((r1, r2)=>{
			var tree = r1[0];
			var status = r2[0];

			tree.forEach((entry)=>{
				if (status[entry]){
					status[entry].inTree = true;
				} else {
					status[entry] = {inTree: true};
				}
			});

			var entriesHtml = []
			Object.keys(status).sort().forEach(entry => {
				entriesHtml.push(<Row name={entry} properties={status[entry]} />)
			})

			ReactDOM.render(
				<Header />,
				document.getElementById('header')
			);

			ReactDOM.render(
				entriesHtml.join(''),
				document.getElementById('repo')
			);
		})
	}

	class Row extends React.Component {
		render () {
			return (
				<div className="entry" onClick={location.hash = '${this.props.name}'}>
					<div className="entry-cell entry-area work">${isInWork(this.props.properties) ? this.props.name : ''}</div>
					<div className="entry-cell diff">${diff(this.props.properties)}</div>
					<div className="entry-cell entry-area cache">${isInCache(this.props.properties) ? this.props.name : ''}</div>
					<div className="entry-cell diffcached">${diffCached(this.props.properties)}</div>
					<div className="entry-cell entry-area tree">${isInTree(this.props.properties) ? this.props.name : ''}</div>
				</div>
				)
		}
	}

	function isInWork(props){
		return !props.isDeleted;
	}

	function isInCache(props){
		return !((props.inIndex && props.isDeleted) || (props.isNew && !props.inIndex));
	}

	function isInTree(props){
		return props.inTree;
	}

	function diff(props){
		if (isInWork(props) && !isInCache(props)){
			return 'untracked'
		}
		if (!isInWork(props) && isInCache(props)){
			return 'deleted'
		}
		if (props.inWorkingTree && ! props.isDeleted && !props.isNew){
			return 'modified'
		}
		return ''
	}
	function diffCached(props){
		if (isInCache(props) && !isInTree(props)){
			return 'new'
		}
		if (!isInCache(props) && isInTree(props)){
			return 'deleted'
		}
		if (props.inIndex && props.isModified){
			return 'modified'
		}
		return ''
	}

	function myLoadAreas(){
		if (document.location.hash !== ''){
	    	loadAreas(document.location.hash.replace('#',''));
	    } else {
			ReactDOM.render(
				'-',
				document.getElementById('filename')
			);
			ReactDOM.render(
				'',
				document.getElementById('tree')
			);
			ReactDOM.render(
				'',
				document.getElementById('work')
			);
			ReactDOM.render(
				'',
				document.getElementById('cache')
			);
	    }
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
}
)