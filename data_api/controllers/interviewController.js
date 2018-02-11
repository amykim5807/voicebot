var Connect = require('tedious').Connection;
var Request = require('tedious').Request;

var config = {
    userName: 'mn-sql-admin@mn-sql-01',
    password: 'TablesPlatesChairs512',
    server: 'mn-sql-01.database.windows.net',
    port: '1433',
    options: {
      database: 'CrossSellDB_Dev_Staging',
      encrypt: true
    }
  }

module.exports.getInterviewQuestions = function (req, res) {
    var connection = new Connect(config);
    connection.on('connect', function(err){
      if (err){
        res.send(err);
      }
      else{
        console.log("Connected");
        idnum = req.query.id;
        questions = {};
            question = new Request("SELECT * FROM Survey.Question", function(err, rows) {
            
            if (err) res.send(err);
            else{
                res.json({interview:idnum,questions:questions});
            }
            });

            question.on('row', function(columns) {
                if (columns[1].value == idnum){
                    questions[columns[0].value] = columns[2].value;
                }
            });
            connection.execSql(question);
        
      };
    });
}

module.exports.getInterviewAnswers = function (req, res) {
    var connection = new Connect(config);
    connection.on('connect', function(err){
      if (err){
        res.send(err);
      }
      else{
        console.log("Connected");
        qid = req.query.id;
        answers = [];
            request = new Request("SELECT * FROM Survey.Answer", function(err, rows) {
            
            if (err) res.send(err);
            else{
                res.json({question:qid,answers:answers});
            }
            });

            request.on('row', function(columns) {
                if (columns[1].value == qid){
                    answers.push([columns[2].value, columns[4].value]);
                }
            });

            connection.execSql(request);
        
      };
    });
}

module.exports.getInterviewID = function (req, res) {
        var connection = new Connect(config);
        idnum = -1
        connection.on('connect', function(err){
          if (err){
            res.send(err);
          }
          else{
            console.log("Connected");
            campaign = req.query.campaign;
                if (typeof campaign == "string"){
                request = new Request("SELECT * FROM Communication.Communication", function(err, rows) {
                if (err) res.send(err);
                else{
                    res.json({ID:idnum,campaign:campaign});
                }
                });

                request.on('row', function(columns) {
                    if (columns[1].value == campaign){
                        idnum = columns[0].value
                    }
                  });
                  connection.execSql(request);
            }
            else{
                console.log('wrong type');
            }
          };
        });
}

module.exports.getInterviewChannel = function (req, res) {
    var connection = new Connect(config);
    connection.on('connect', function(err){
      if (err){
        res.send(err);
      }
      else{
        console.log("Connected");
        idnum = req.query.id;
            if (typeof campaign == "string"){
            request = new Request("SELECT * FROM Survey.SurveyChannel", function(err, rows) {
            if (err) res.send(err);
            else{
                res.json({ID:idnum,campaign:campaign});
            }
            });

            request.on('row', function(columns) {
                if (columns[1].value == campaign){
                    idnum = columns[0].value
                }
              });
              connection.execSql(request);
        }
        else{
            console.log('wrong type');
        }
      };
    });
}