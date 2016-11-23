var nodegit = require("nodegit"),
    path = require("path");

const statusToArea = (status) => {
  console.log(statusToText(status))
  return {
    WORK: status.inWorkingTree(),
    CACHE: !(status.inIndex() && status.isDeleted()) && !(!status.inIndex() && status.isNew()),
  }
}
function statusToText(status) {
  var words = [];
  // if (status.isNew()) { words.push("NEW"); }
  // if (status.isModified()) { words.push("MODIFIED"); }
  // if (status.isTypechange()) { words.push("TYPECHANGE"); }
  // if (status.isRenamed()) { words.push("RENAMED"); }
  // if (status.isIgnored()) { words.push("IGNORED"); }
  words.push(status.path())

  if (status.headToIndex()) {words.push('headToIndex')}
  if (status.indexToWorkdir()) {words.push('indexToWorkdir')}
  if (status.inIndex()) {words.push('inIndex')}
  if (status.inWorkingTree()) {words.push('inWorkingTree')}
  if (status.isConflicted()) {words.push('isConflicted')}
  if (status.isDeleted()) {words.push('isDeleted')}
  if (status.isIgnored()) {words.push('isIgnored')}
  if (status.isModified()) {words.push('isModified')}
  if (status.isNew()) {words.push('isNew')}
  if (status.isRenamed()) {words.push('isRenamed')}
  if (status.isTypechange()) {words.push('isTypechange')}

  return words.join(" - ");
}



const getRepo = function() {return nodegit.Repository.open("/Users/sac/Downloads/testpatch/.git")}

function getTree(cb){
  getRepo()
    .then(function(repo) {
      repo.getHeadCommit().then(function(commit){
      commit.getTree().then(function(tree){
        var walker = tree.walk();
        var files = []

        walker.on("entry", function(entry) {
          files.push(entry.path());
        });

        walker.start();
        cb(files);
      })
    })
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
  res = {}
  statuses.forEach(function(file) {
    res[file.path()] = buildStatus(file)
  })
  return res;
}

function getStatus(cb){
  getRepo()
    .then(function(repo) {
      repo.getStatus().then(function(statuses) {
          cb(statusToJson(statuses));
      });
  });
}

function getTree(cb){
  getRepo()
    .then(function(repo) {
      repo.getHeadCommit().then(function(commit){
      commit.getTree().then(function(tree){
        var walker = tree.walk();
        var files = []

        walker.on("entry", function(entry) {
          files.push(entry.path());
        });

        walker.start();
        cb(files);
      })
    })
  });
}

function getFile(entry, cb){
  getRepo()
    .then(function(repo) {
      return repo.getHeadCommit()
      })
    .then(function(commit){
         return commit.getEntry(entry);
    })
  .then(function(entry) {
    _entry = entry;
    return _entry.getBlob();
  })
  .then(function(blob) {
    cb(blob.toString())
  })
}

var diffIndex = function(repo, commit, resource, cb){
    return commit.getTree()
    .then(function(tree){
        return nodegit.Diff.treeToIndex(repo, tree);
    })
    .then(function(diff){
        return diff.patches();
    }).then(function(p){
      if (p.length > 0){

      p.forEach((patch) => {
        if (patch.oldFile().path() === resource){
          // console.log('patch of ', patch.oldFile().path());
          // console.log('hunks');
          patch.hunks().then((hunks)=>{ 
            // console.log(hunks)
            // console.log('getting lines')
            var lines = hunks.map(hunk => hunk.lines())


            // console.log('getting lines', lines)
            Promise.all(lines).then((retrievedLines) => {
              // console.log('asd')
              var res = []
              for (var i = hunks.length - 1; i >= 0; i--) {
                hunks[i]
                res.push({
                  oldStart: hunks[i].oldStart(),
                  oldLines: hunks[i].oldLines(),
                  lines: retrievedLines[i].filter(x=>x.newLineno()!==-1).map((x)=>x.rawContent())
                })
              }
              cb(res);
            })


          })
        }
      })
    } else {
      cb([]);
    }
    });
};
var diffWorkdir = function(repo, commit, resource, cb){
    return commit.getTree()
    .then(function(tree){
        return nodegit.Diff.treeToWorkdir(repo, tree);
    })
    .then(function(diff){
        return diff.patches();
    }).then(function(p){
      if (p.length > 0){

      p.forEach((patch) => {
        if (patch.oldFile().path() === resource){
          // console.log('patch of ', patch.oldFile().path());
          // console.log('hunks');
          patch.hunks().then((hunks)=>{ 
            // console.log(hunks)
            // console.log('getting lines')
            var lines = hunks.map(hunk => hunk.lines())


            // console.log('getting lines', lines)
            Promise.all(lines).then((retrievedLines) => {
              // console.log('asd')
              var res = []
              for (var i = hunks.length - 1; i >= 0; i--) {
                hunks[i]
                res.push({
                  oldStart: hunks[i].oldStart(),
                  oldLines: hunks[i].oldLines(),
                  lines: retrievedLines[i].filter(x=>x.newLineno()!==-1).map((x)=>x.rawContent())
                })
              }
              cb(res);
            })


          })
        }
      })
    } else {
      cb([])
    }
    });
};



function getDiff(resource, cb){
  console.log('diff')
  var rr;
  getRepo()
  .then(function(repo) {
    rr = repo;
    return repo.getHeadCommit();
  })
  .then(function(commit) {
  console.log('diff')
    return diffWorkdir(rr, commit, resource, cb)
  })
}
function getDiffCached(resource, cb){
  console.log('diffcached')
  var rr;
  getRepo()
  .then(function(repo) {
    rr = repo;
    return repo.getHeadCommit();
  })
  .then(function(commit) {
  console.log('diff')
    return diffIndex(rr, commit, resource, cb)
  })
}

function getDiffCommit(resource, cb){

  getRepo()
  .then(function(repo) {
    return repo.getHeadCommit();
  })
  .then(function(commit) {
    return commit.getDiff();
  })
  .done(function(diffList) {
    diffList.forEach(function(diff) {
      diff.patches().then(function(patches) {
        patches.forEach(function(patch) {
          patch.hunks().then(function(hunks) {
            hunks.forEach(function(hunk) {
              hunk.lines().then(function(lines) {
                if (patch.oldFile().path() === resource){
                  // console.log("diff", patch.oldFile().path(), patch.newFile().path());
                  // console.log(hunk.header().trim());
                  lines.forEach(function(line) {
                    console.log(String.fromCharCode(line.origin()) +
                      line.content().trim());
                  });
                }
              });
            });
          });
        });
      });
    });
  });
}


module.exports = {getStatus, getTree, getFile, getDiff, getDiffCached}