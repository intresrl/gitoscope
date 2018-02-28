(function(){
	window.GL.utilities.isInWork = function isInWork(props){
		return !props.isDeleted;
	}
})();

(function(){
	window.GL.utilities.isInCache = function isInCache(props){
		return !((props.inIndex && props.isDeleted) || (props.isNew && !props.inIndex));
	}
})();

(function(){
	window.GL.utilities.isInTree = function isInTree(props){
		return props.inTree;
	}
})();

(function(){
	window.GL.utilities.diff = function diff(props){
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
})();

(function(){
	window.GL.utilities.diffCached = function diffCached(props){
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
})();