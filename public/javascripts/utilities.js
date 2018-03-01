(function(){
	window.GL.utilities.isInWork = function isInWork(props){
		return !props.isDeleted;
	}

	window.GL.utilities.isInCache = function isInCache(props){
		return !((props.inIndex && props.isDeleted) || (props.isNew && !props.inIndex));
	}

	window.GL.utilities.isInTree = function isInTree(props){
		return props.inTree;
	}

	window.GL.utilities.diff = function diff(props){
		if (GL.utilities.isInWork(props) && !GL.utilities.isInCache(props)){
			return 'untracked'
		}
		if (!GL.utilities.isInWork(props) && GL.utilities.isInCache(props)){
			return 'deleted'
		}
		if (props.inWorkingTree && ! props.isDeleted && !props.isNew){
			return 'modified'
		}
		return ''
	}

	window.GL.utilities.diffCached = function diffCached(props){
		if (GL.utilities.isInCache(props) && !GL.utilities.isInTree(props)){
			return 'new'
		}
		if (!GL.utilities.isInCache(props) && GL.utilities.isInTree(props)){
			return 'deleted'
		}
		if (props.inIndex && props.isModified){
			return 'modified'
		}
		return ''
	}
})();