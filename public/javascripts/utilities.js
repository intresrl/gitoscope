(function(){
	window.Gitoscope.utilities.isInWork = function isInWork(props){
		return !props.isDeleted;
	}

	window.Gitoscope.utilities.isInCache = function isInCache(props){
		return !((props.inIndex && props.isDeleted) || (props.isNew && !props.inIndex));
	}

	window.Gitoscope.utilities.isInTree = function isInTree(props){
		return props.inTree;
	}

	window.Gitoscope.utilities.diff = function diff(props){
		if (Gitoscope.utilities.isInWork(props) && !Gitoscope.utilities.isInCache(props)){
			return 'untracked';
		}
		if (!Gitoscope.utilities.isInWork(props) && Gitoscope.utilities.isInCache(props)){
			return 'deleted';
		}
		if (props.inWorkingTree && ! props.isDeleted && !props.isNew){
			return 'modified';
		}
		return '';
	}

	window.Gitoscope.utilities.diffCached = function diffCached(props){
		if (Gitoscope.utilities.isInCache(props) && !Gitoscope.utilities.isInTree(props)){
			return 'new';
		}
		if (!Gitoscope.utilities.isInCache(props) && Gitoscope.utilities.isInTree(props)){
			return 'deleted';
		}
		if (props.inIndex && props.isModified){
			return 'modified';
		}
		return '';
	}
})();