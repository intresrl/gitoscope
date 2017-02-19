const nodegit = require("nodegit");
const path = require("path");

const repository = "/Users/sac/Downloads/testpatch/.git";

const getRepo = function() {
    return nodegit.Repository.open(repository)
};

function getTree(){
    return new Promise((resolve, reject)=>{
        const repo = getRepo();
        const headCommit = repo.then(repo=>repo.getHeadCommit());
        const tree = headCommit.then(commit=>commit.getTree());
        tree.then(function(tree){
            const walker = tree.walk();
            const files = [];
            walker.on("entry", function(entry) {
                files.push(entry.path());
            });
            walker.start();
            resolve(files);
        });
    });
}

function buildStatus(status){
      return {
        headToIndex : Boolean(status.headToIndex()),
        indexToWorkdir : Boolean(status.indexToWorkdir()),
        inIndex : Boolean(status.inIndex()),
        inWorkingTree : Boolean(status.inWorkingTree()),
        isConflicted : Boolean(status.isConflicted()),
        isDeleted : Boolean(status.isDeleted()),
        isIgnored : Boolean(status.isIgnored()),
        isModified : Boolean(status.isModified()),
        isNew : Boolean(status.isNew()),
        isRenamed : Boolean(status.isRenamed()),
        isTypechange : Boolean(status.isTypechange()),
      }
}

function statusToJson(statuses){
  res = {};
  statuses.forEach(function(file) {
    res[file.path()] = buildStatus(file)
  });
  return res;
}

function getStatus(){
    return new Promise((resolve, reject)=>{
        const repo = getRepo();
        const status = repo.then((repo) => repo.getStatus());
        status.then((statuses) => resolve(statusToJson(statuses)));
    });
}

function getFile(entry){
    return new Promise((resolve, reject)=>{
        const repo = getRepo();
        const headCommit = repo.then(repo=>repo.getHeadCommit());
        const entryObj = headCommit.then(commit=>commit.getEntry(entry));
        const blob = entryObj.then(entry=>entry.getBlob());
        blob.then(function(blob){
            resolve(blob.toString());
        }).catch(()=>resolve([]));
    });
}

function diffToX(functionX, repo, commit, resource, cb) {
    return commit.getTree()
        .then(function (tree) {
            return nodegit.Diff[functionX].call(null, repo, tree);
        })
        .then(function (diff) {
            return diff.patches();
        }).then(function (p) {
            if (p.length > 0) {
                let found = false;
                p.forEach((patch) => {
                    if (patch.oldFile().path() === resource) {
                        found = true;
                        patch.hunks().then((hunks) => {
                            const lines = hunks.map(hunk => hunk.lines());
                            Promise.all(lines).then((retrievedLines) => {
                                const res = [];
                                for (let i = hunks.length - 1; i >= 0; i--) {
                                    res.push({
                                        oldStart: hunks[i].oldStart(),
                                        oldLines: hunks[i].oldLines(),
                                        lines: retrievedLines[i].filter(x => x.newLineno() !== -1).map((x) => x.rawContent())
                                    })
                                }
                                cb(res);
                            })
                        })
                    }
                });
                if (!found) {
                    cb([]);
                }
            } else {
                cb([]);
            }
        });
}

const diffIndex = diffToX.bind(null, 'treeToIndex');
const diffWorkdir = diffToX.bind(null, 'treeToWorkdir');

function getDiff(resource, cb){
  let rr;
  const repo = getRepo();
  const headCommit = repo.then((repo)=>{
    rr = repo;
    return repo.getHeadCommit();
  });
  headCommit.then(function(commit) {
    diffWorkdir(rr, commit, resource, cb)
  })
}
function getDiffCached(resource, cb){
  let rr;
  const repo = getRepo();
  const headCommit = repo.then((repo)=>{
    rr = repo;
    return repo.getHeadCommit();
  });
  headCommit.then(function(commit) {
    diffIndex(rr, commit, resource, cb)
  })
}

module.exports = {getStatus, getTree, getFile, getDiff, getDiffCached};