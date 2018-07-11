(function(){
	const Table = Gitoscope.Table;

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
				$.get('/api/status', status => {
					const entries = Object.keys(status).sort().map(entry => {
						return {record:entry, status:status[entry]};
					});

					this.setState({rows : entries});
				});
			},

			myLoadAreas(){
				if (document.location.hash !== '') {
					this.loadAreas(document.location.hash.replace('#',''));
				} else {
					this.setState({currentFileName: '-', currentFileWorkingCopy: '', currentFileCached: '', currentFileCommitted: ''});
				}
			},

			loadAreas(name){
				let workPromise = $.get(`/api/diff/${name}`);
				let cachePromise = $.get(`/api/diffCached/${name}`);
				let treePromise = $.get(`/api/entry/${name}`);

				$.when(workPromise, cachePromise, treePromise).then((r1, r2, r3)=>{
					const tree = r3[0];
                    const diff = r1[0];
                    const diffCached = r2[0];

                    const nextState = {
                    	currentFileName: name,
						currentFileCommitted: tree,
                        currentFileWorkingCopy : diff,
                        currentFileCached : diffCached
                    };

					this.setState(nextState);
				});
			},

			render() {
				return (
					<div>
						<div className="title">
                            <div>
                                <div className="titleLogo">
                                    <img src="./images/gitoscope_logo.png" />
                                    <h1 className="display-4">Gitoscope </h1>
								</div>
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
						<Table rows={this.state.rows} />
                        <div id="filename" >
                            <h3 id="filenamename" >{this.state.currentFileName}</h3>
						</div>
                        <div id="areas" >
                            <div id="work" >{this.state.currentFileWorkingCopy}</div>
                            <div id="cache" >{this.state.currentFileCached}</div>
                            <div id="tree" >{this.state.currentFileCommitted}</div>
						</div>
					</div>
					);
			}
	});
})();