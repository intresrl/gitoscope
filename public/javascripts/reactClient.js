//alert("qui ci metto tutto quello che serve per react")

$( document ).ready(function() {

	const GitLens = React.createClass({
		getInitialState () {
			return {
				workingCopy: [],
				stagingArea: [],
				headCommit: []
			};
		},

		manageChange(){
			if (this.checked){
				loadData();
				setTimeout(this.manageChange, 500);
			}
		},

		change(event) {
			this.checked = event.target.checked;
			if (this.checked){
				this.manageChange();
			}
		},

		render() {
			return (
				<div>
					<div>
						<h1>GitLens 2.0</h1>
						<span>Welcome to GitLens</span>
					</div>
					<div style={{marginTop: '14px'}}>
						<button onClick={loadData}>reload</button>
						<span style={{marginLeft: '20px'}}>
							autoreload <input type="checkbox" id="autoreload" onChange={this.change} />
						</span>
					</div>
					<div>
						<Header classNameDivAreas="header-entry" classNameSingleAreas="area-title" titleArea1="Working copy" titleArea2="Staging Area" titleArea3="HEAD commit" />
					</div>
				</div>
				);
		}
	});

	const Header = React.createClass({
		render() {
			return (
				<div className={this.props.classNameDivAreas}>
					<div className={this.props.classNameSingleAreas}>{this.props.titleArea1}</div>
					<div className={this.props.classNameSingleAreas}>{this.props.titleArea2}</div>
					<div className={this.props.classNameSingleAreas}>{this.props.titleArea3}</div>
				</div>
				)
		}
	});

	function loadData() {
		updateStatus();
		myLoadAreas();
	}

	/*function updateStatus(){
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
				entriesHtml.join(''),
				document.getElementById('repo')
			);
		})
	}*/

	//INIZIO TEST

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
				entriesHtml.push(renderRow(entry, status[entry]))
			})

			$('#repo').html(entriesHtml.join(''))

		})
	}

	function renderRow(name, props){
		return `<div class="entry" onclick="location.hash = '${name}';">
			<div class="entry-cell entry-area work">${isInWork(props) ? name : ''}</div>
			<div class="entry-cell diff">${diff(props)}</div>
			<div class="entry-cell entry-area cache">${isInCache(props) ? name : ''}</div>
			<div class="entry-cell diffcached">${diffCached(props)}</div>
			<div class="entry-cell entry-area tree">${isInTree(props) ? name : ''}</div>
		</div>`
	}


	//FINE TEST

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
            $('#filenamename').html('-');
			$('#tree').html('');
			$('#work').html('');
			$('#cache').html('');
	    }
	}


	function loadAreas(name){
	    var workPromise = $.get(`/api/diff/${name}`);
	    var cachePromise = $.get(`/api/diffCached/${name}`);
	    var treePromise = $.get(`/api/entry/${name}`);
    	$.when(workPromise,cachePromise,treePromise).then((r1, r2, r3)=>{
    		$('#filenamename').html(name);
			var tree = r3[0];
			$('#tree').html(tree);


			var diff = r1[0];
			if (diff.length > 0){
						var work = tree.split(/\r?\n/).map(x=>x+'\n');
						var work1 = applyDiffLines(work, diff[0].oldStart, diff[0].oldLines, diff[0].lines)
						$('#work').html(work1.join(''));
			} else {
						$('#work').html(tree);

			}
			var diffCached = r2[0];
			if (diffCached.length > 0){
						var cache = tree.split(/\r?\n/).map(x=>x+'\n');
						var cache1 = applyDiffLines(cache, diffCached[0].oldStart, diffCached[0].oldLines, diffCached[0].lines)
						$('#cache').html(cache1.join(''));
					} else {
						$('#cache').html(tree);
						
					}

		});

    }

	function renderGitLens() {
		ReactDOM.render(
		<GitLens />,
		document.getElementById('GitLens')
		);
	}

	renderGitLens();
	loadData();

}
)