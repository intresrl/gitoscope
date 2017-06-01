const buildBaseUrlFactory = (root)=>{return (id)=>`/${root}/${id}`};

const buildTreeUrl = buildBaseUrlFactory('trees');
const buildBlobUrl = buildBaseUrlFactory('blobs');
const buildCommitUrl = buildBaseUrlFactory('commits');

const commitFactory = function(commit){
    return {
        id: commit.id().tostrS(),
        author: commit.author().toString(),
        message: commit.message(),
        parents: commit.parents().map(oid => oid.tostrS()),
        tree: {
            id: commit.treeId().tostrS(),
            url: buildTreeUrl(commit.treeId().tostrS())
        }

    };
};

const treeFactory = function(tree){
    return {
        id: tree.id().tostrS(),
        url: buildTreeUrl(tree.id().tostrS()),
        entries: tree.entries().map(treeEntryFactory),
    };
};


const treeTreeEntryFactory = function(entry){
    return {
        url: buildTreeUrl(entry.sha()),
        type: 'tree'
    };
};

const blobTreeEntryFactory = function(entry){
    return {
        url: buildBlobUrl(entry.sha()),
        type: 'blob'
    };
};

const treeEntryFactory = function(entry){
    let entryType = {};
    if (entry.isTree()){
        entryType = treeTreeEntryFactory(entry);
    } else if (entry.isBlob()){
        entryType = blobTreeEntryFactory(entry);
    }

    return Object.assign({}, {
        id: entry.sha(),
        name: entry.name(),
    }, entryType);
};

const blobFactory = function(blob){
    return {
        id: blob.id().tostrS(),
        content: blob.rawcontent().toString('utf8'),
        size: blob.rawsize(),
        url: buildBlobUrl(blob.id().tostrS())
    };
};

const referenceFactory = function(reference, isHead){
    const target = reference.target();
    const targetId = target?target.tostrS():'';

    const referenceType = reference.isTag()?'tag':reference.isBranch()?'branch':'other';

    return {
        name: isHead?'HEAD':reference.name(),
        resolvedReference: targetId,
        reference: isHead && reference.isBranch()?reference.name():targetId,
        url: '',
        pointedByHead:reference.isHead(),
        type: referenceType,
        sy : reference.isSymbolic()
    }
};

module.exports = {commitFactory, treeFactory, blobFactory, referenceFactory};
