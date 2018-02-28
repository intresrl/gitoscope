const Table = GL.Table;
const Header = GL.Header;

(function(){
	window.GL.GitLens = React.createClass({
			getInitialState () {
				this.hashManager()
				this.loadData();
				return {
					rows: []
				};
			},

			manageCheckbox(){
				if (this.checked){
					this.loadData();
					setTimeout(this.manageCheckbox, 500);
				}
			},

			tickCheckbox(event) {
				this.checked = event.target.checked;
				if (this.checked){
					this.manageCheckbox();
				}
			},

			hashManager() {
				$(window).bind('hashchange', (function(e) { 
								var anchor = document.location.hash;
								this.loadAreas(anchor.replace('#', ''))
							}).bind(this));
			},

			loadData() {
				this.updateStatus();
				this.myLoadAreas();
			},

			updateStatus(){
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

					var entries = [];
					Object.keys(status).sort().forEach(entry => {
						var row = {record:entry, status:status[entry]};
						entries.push(row);
					});

					this.setState({rows : entries});
				})
			},

			myLoadAreas(){
				if (document.location.hash !== ''){
					this.loadAreas(document.location.hash.replace('#',''));
				} else {
					$('#filenamename').html('-');
					$('#tree').html('');
					$('#work').html('');
					$('#cache').html('');
				}
			},

			loadAreas(name){
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
						var work1 = this.applyDiffLines(work, diff[0].oldStart, diff[0].oldLines, diff[0].lines)
						$('#work').html(work1.join(''));
					} else {
						$('#work').html(tree);
					}
					var diffCached = r2[0];
					if (diffCached.length > 0){
						var cache = tree.split(/\r?\n/).map(x=>x+'\n');
						var cache1 = this.applyDiffLines(cache, diffCached[0].oldStart, diffCached[0].oldLines, diffCached[0].lines)
						$('#cache').html(cache1.join(''));
					} else {
						$('#cache').html(tree);
					}
				});
			},

			applyDiffLines(oldLinesv, oldStart, oldLines, lines){
				oldLinesv.splice(oldStart -1, oldLines, ...lines)
				return oldLinesv;
			},

			render() {
				return (
					<div>
						<div className="jumbotron title">
	  						<h1 className="display-4">GitLens 2.0 <img width="6%" src=".././images/gitLogo.png" /></h1>
	  						<p className="lead">Welcome to GitLens</p>
	  						<hr className="my-4" />
	  						<p className="lead" style={{marginTop: '14px'}}>
								<button type="button" className="btn btn-outline-dark" onClick={this.loadData}>reload</button>
								<span style={{marginLeft: '20px'}}>
									autoreload <input type="checkbox" id="autoreload" onChange={this.tickCheckbox} />
								</span>
	  						</p>
						</div>
						<div>
							<Header classNameDivAreas="header-entry" classNameSingleAreas="area-title" titleArea1="Working copy" titleArea2="Staging Area" titleArea3="HEAD commit" />
							<Table rows={this.state.rows} />
						</div>
					</div>
					);
			}
	});
})()