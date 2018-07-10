(function(){
	const Table = Gitoscope.Table;
	const Header = Gitoscope.Header;

	window.Gitoscope.Gitoscope = React.createClass({
			getInitialState () {
				return {
					rows: []
				};
			},

			componentWillMount () {
				this.hashManager();
				this.loadData();
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
				$(window).bind('hashchange', (function() { 
								let anchor = document.location.hash;
								this.loadAreas(anchor.replace('#', ''));
							}).bind(this));
			},

			loadData() {
				this.updateStatus();
				this.myLoadAreas();
			},

			updateStatus(){
				let treePromise = $.get('/api/tree');
				let statusPromise = $.get('/api/status');

				$.when(treePromise, statusPromise).then((r1, r2)=>{
					let tree = r1[0];
					let status = r2[0];

					tree.forEach((entry) => {
						if (status[entry]){
							status[entry].inTree = true;
						} else {
							status[entry] = {inTree: true};
						}
					});

					let entries = [];
					Object.keys(status).sort().forEach(entry => {
						let row = {record:entry, status:status[entry]};
						entries.push(row);
					});

					this.setState({rows : entries});
				})
			},

			myLoadAreas(){
				if (document.location.hash !== '') {
					this.loadAreas(document.location.hash.replace('#',''));
				} else {
					$('#filenamename').html('-');
					$('#tree').html('');
					$('#work').html('');
					$('#cache').html('');
				}
			},

			loadAreas(name){
				let workPromise = $.get(`/api/diff/${name}`);
				let cachePromise = $.get(`/api/diffCached/${name}`);
				let treePromise = $.get(`/api/entry/${name}`);

				$.when(workPromise, cachePromise, treePromise).then((r1, r2, r3)=>{
					$('#filenamename').html(name);
					let tree = r3[0];
					$('#tree').html(tree);

					let diff = r1[0];
					if (diff.length > 0){
						let work = tree.split(/\r?\n/).map(x => x + '\n');
						let workDiffLines = this.applyDiffLines(work, diff[0].oldStart, diff[0].oldLines, diff[0].lines);
						$('#work').html(workDiffLines.join(''));
					} else {
						$('#work').html(tree);
					}
					
					let diffCached = r2[0];
					if (diffCached.length > 0){
						let cache = tree.split(/\r?\n/).map(x => x + '\n');
						let cacheDiffLines = this.applyDiffLines(cache, diffCached[0].oldStart, diffCached[0].oldLines, diffCached[0].lines);
						$('#cache').html(cacheDiffLines.join(''));
					} else {
						$('#cache').html(tree);
					}
				});
			},

			applyDiffLines(oldLinesv, oldStart, oldLines, lines){
				oldLinesv.splice(oldStart -1, oldLines, ...lines);
				return oldLinesv;
			},

			render() {
				return (
					<div>
						<div className="title">
                            <div>
                                <h1 className="display-4"><img width="6%" src="./images/gitoscope_logo.png" />Gitoscope </h1>
                                <a target="_blank" href="/internals">go to the graph of the repository</a>
							</div>
	  						<div className="reloader">
								<button type="button" className="btn btn-outline-dark" onClick={this.loadData}>reload</button>
								<span style={{marginLeft: '20px'}}>
									autoreload <input type="checkbox" id="autoreload" onChange={this.tickCheckbox} />
								</span>
	  						</div>
						</div>
                        <hr className="my-4" />
						<div>
							<Header classNameDivAreas="header-entry" classNameSingleAreas="area-title" titleArea1="Working copy" titleArea2="Staging Area" titleArea3="HEAD commit" />
							<Table rows={this.state.rows} />
						</div>
					</div>
					);
			}
	});
})()