function getReferences(){
    return $.get('/api/references');
}

function getHeadReference(){
    return new Promise((resolve, reject)=>{
       getReferences().then(data=>{
           resolve(data.filter(data=>data.name == 'HEAD')[0].resolvedReference);
       })
    });
}

function getCommit(commitId) {
    return $.get('/api/commits/' + commitId);
}
function getTree(treeId) {
    return $.get('/api/trees/' + treeId);
}
function getBlob(blobId) {
    return $.get('/api/blobs/' + blobId);
}


function getHeadCommit(){
    return getHeadReference().then(headReference=>{
        return getCommit(headReference);
    })
}


$( document ).ready(function() {


    const elements = {
        nodes: [
            { data: { id: 'c1', name: 'Wilno'}, renderedPosition: {x: 30, y:30}},
            { data: { id: 'c2', name: 'Zagrab'}, position: {x: 30, y:50}},
            { data: { id: 'c3', name: 'Zurich'}, position: {x: 293, y:50}},
        ],
        edges: [
            {data: {source:'c1',  target: 'c2', weight: 3}},
            {data: {source:'c1',  target: 'c2', weight: 3, gallery:1}},
            {data: {source:'c2',  target: 'c3', weight: 4 }}

        ]
    };

    let head = null;
    let currentY = 30;
    const commitX = 30;

    function getTreeRecurse(treeId){
        return getTree(treeId).then(tree=>{
            return new Promise((resolve, reject)=>{
                tree.entries.forEach(entry=>{
                    const nestedTreesPromises = [];
                    if (entry.type == 'tree'){
                       addTree(entry.id, tree.id);
                       nestedTreesPromises.push(getTreeRecurse(entry.id));
                    } else if (entry.type == 'blob'){
                        addBlob(entry.id, tree.id)
                    }
                    Promise.all(nestedTreesPromises).then(()=>resolve());
                });
            });
        })
    }

    getHeadCommit().then(addCommitToTreeWithInternals);

    function addCommitToTreeWithInternals(commit){
        head = null;
        if (commit.parents.length > 0){
            addCommit(commit.parents[0]);
        }
        cy.elements('#'+commit.parents[0]).once('click', function(event){
            getCommit(event.cyTarget.data().id).then(addCommitToTreeWithInternals);
            // console.log(event.cy);
        });
        addCommit(commit.id);
        addTree(commit.tree.id, commit.id);
        getTreeRecurse(commit.tree.id).then(()=>{
            cy.elements("node[type='tree'], node[type='blob'], edge").layout({name:'dagre', rankDir:'LR'});
        })
    }

    // addCommit(getHeadCommit());

    function addCommit(id) {
        const elements = {
            nodes: [
                {data: {id: id, name: id.substr(0, 7), type: 'commit'}, renderedPosition: {x: commitX, y: currentY}},
            ]
        };
        if (head) {
            elements.edges = [
                {data: {id: id+head, source: id, target: head, weight: 3}},
            ]
        }

        cy.add(elements);
        currentY += 50;
        head = id;
    }

    function addObject(id, type, relatesTo) {
        // if is a commit, the arrow should point to the element relatesTo, which is a parent
        // else, we are adding a tree or a blob, so the relationship is that the parent "contains"
        // so we want to point the arrow to the cointained item
        const elements = {
            nodes: [{data: {id: id, name: id.substr(0, 7), type: type}},{data: {id: relatesTo, name: relatesTo}}],
            edges: [{data: {id: [id, relatesTo].sort().join(),
                source: type == 'commit' ? id : relatesTo,
                            target: type == 'commit' ? relatesTo : id,
                            type: type == 'commit' ? 'commit' : 'internal',
                            weight: 3}},]
        };

        cy.add(elements);
    }

    function addTree(id, parent){
        const type = 'tree';
        addObject(id, type, parent);
    }
    function addBlob(id, parent){
        const type = 'blob';
        addObject(id, type, parent);
    }

    window.ac = addCommit;

    const colorMap = {
        'tree': 'green',
        'commit': 'orange',
        'blob': 'black',
        'default': 'red'
    };

    const chooseColor = (element) => {
        return colorMap[element.data('type') || 'default'] || colorMap['default'];
    };


    const cy = cytoscape({
        container: document.getElementById('gitgraph'),
        layout: { name: 'random' },
        style: [{
            selector: 'edge',
            style: {
                'curve-style': 'bezier',
                'width': 3,
                'line-color': '#ccc',
                'target-arrow-fill': '#ccc',
                'target-arrow-shape': 'triangle'
            }

        },{
            selector: 'node',
            style: {
                'content': 'data(name)',
                'text-opacity': 0.5,
                'text-valign': 'center',
                'text-halign': 'right',
                'text-margin-x': 5,
                'background-color': chooseColor,
                // 'border-color': cargo.chooseBorder,
                'text-background-color':'white',
                'text-background-opacity':0.8,

                'border-width': 3
            }

        }],
        elements: null,
        motionBlur: true,
        selectionType: 'single',
        boxSelectionEnabled: false
    });

    // addCommit('c1');
    // addCommit('c2');
    // addCommit('c3');
    // addTree('t1','c1');
    // addTree('t2','c2');
    // addTree('t3','c3');
    // addBlob('b1', 't1');
    // addTree('t11', 't1');
    // addBlob('b11', 't11');
    // addBlob('b11', 't3');
    //
    // cy.add({nodes:[{data:{id:'root'}}]});
    // addTree('c1', 'root');
    // addTree('c2', 'root');
    // addTree('c3', 'root');

    // cy.$('#c1').renderedPosition({x: 30, y:30});
    // cy.$('#c1').lock();
    // cy.layout({name:'random'});
    // cy.elements("node[type='tree'], node[type='blob'], edge").layout({name:'dagre', rankDir:'LR'});
    // cy.elements("#c1").successors('node[type="blob"],node[type="tree"]').layout({name:'dagre', rankDir:'LR'});
    // cy.elements("node[type='commit']").forEach(x=> {
    //     // console.log(x.id());
    //     const a = x.neighborhood('node[type="tree"]').union(cy.elements('edge')).union(x.neighborhood('node[type="tree"]').successors('node[type="blob"],node[type="tree"]'))
    //
    //     a.layout({name: 'dagre', rankDir: 'LR'});
    //     console.log(a.map(x=>x.id()));
    // });

    // cy.elements('#root').union(cy.elements('node[type="commit"]', 'edge[type="internal"]')).union(cy.elements('#root').successors()).layout({name: 'dagre', rankDir: 'LR'});
    // cy.elements('node[type="commit"]').map(x=>x.renderedPosition('x', 300));
    // cy.elements('#root').remove();

    // cy.elements('node[type="commit"]').on('click', function(event){
    //     console.log(event.cyTarget.data().id);
    // });
    window.cy= cy;
    // cy.elements("#t1, #b1,#t11, #b11,edge").layout({name:'dagre', rankDir:'LR'});
});