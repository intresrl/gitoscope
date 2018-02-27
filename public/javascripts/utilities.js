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