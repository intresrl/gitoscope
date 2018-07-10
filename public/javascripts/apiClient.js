$( document ).ready(function() {

    $(window).bind( 'hashchange', function(e) { 
	    var anchor = document.location.hash;
	    loadAreas(anchor.replace('#', ''))
    });

    //ok
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


	function applyDiffLines(oldLinesv, oldStart, oldLines, lines){
	  oldLinesv.splice(oldStart -1, oldLines, ...lines)
	  return oldLinesv;
	}

	function applyDiff(oldLines, patch){
	  patch.hunks().then((hunks)=>{ 
	    hunks.forEach((hunk)=> {
	      console.log(hunk.oldStart());
	      console.log(hunk.oldLines());
	      console.log(hunk.newLines());

	      hunk.lines().then((lines)=> {
	          console.log(lines)
	          console.log(lines.map((x)=>[x.rawContent(), x.oldLineno(), x.newLineno()]))
	        })
	      })
	  })
	}

	//ok
	function renderHeader(){
		return `<div class="header-entry">
			<div class='area-title'>Working copy</div>
			<div class='area-title'>Staging Area</div>
			<div class='area-title'>HEAD commit</div>
		</div>`
		
	}

	//ok
	function isInWork(props){
		return !props.isDeleted;
	}

	//ok
	function isInCache(props){
		return !((props.inIndex && props.isDeleted) || (props.isNew && !props.inIndex));
	}

	//ok
	function isInTree(props){
		return props.inTree;
	}

	//ok
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

	//ok
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

	//ok
	function renderRow(name, props){
		return `<div class="entry" onclick="location.hash = '${name}';">
			<div class="entry-cell entry-area work">${isInWork(props) ? name : ''}</div>
			<div class="entry-cell diff">${diff(props)}</div>
			<div class="entry-cell entry-area cache">${isInCache(props) ? name : ''}</div>
			<div class="entry-cell diffcached">${diffCached(props)}</div>
			<div class="entry-cell entry-area tree">${isInTree(props) ? name : ''}</div>
		</div>`
	}
	
	//ok
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

			$('#header').html(renderHeader() )
			$('#repo').html(entriesHtml.join(''))

		})
	}

	//ok
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

	//ok
	function loadData(){
		updateStatus();
		myLoadAreas();
	}

	//ok
	$('#reload').click(loadData)

	//ok
	var checked;
    function manageChange(){
		if (checked){
            loadData();
            setTimeout(manageChange, 500);
		}
    }

    //ok
	$(':checkbox').change(function() {
        checked = this.checked;
        if (this.checked){
			manageChange();
        }

	})

	//ok
	loadData()

});