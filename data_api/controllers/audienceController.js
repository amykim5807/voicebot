var Connect = require('tedious').Connection;
var Request = require('tedious').Request;

var config = {
    userName: 'mn-sql-admin@mn-sql-01',
    password: 'TablesPlatesChairs512',
    server: 'mn-sql-01.database.windows.net',
    port: '1433',
    options: {
      database: 'CrossSellDB_Dev_Usalliance',
      encrypt: true
    }
  }

exports.getAudience = function (req, res) {
        count = 0;
        var connection = new Connect(config);
        connection.on('connect', function(err){
          if (err){
            res.send(err);
          }
          else{
            console.log("Connected");
            campaign = req.query.campaign;
            console.log(campaign);
                if (typeof campaign == "string"){
                request = new Request("SELECT " + campaign.toUpperCase().replace(/ /g,"_") + " FROM ML.Propensity_Score", function(err, rowCount, rows) {
                console.log('hi')
                if (err) res.send(err);
                else{
                    console.log(rowCount + ' row(s) returned');
                    res.json({size:count});
                    //program.exit();
                }
                });

                request.on('row', function(columns) {
                    columns.forEach(function(column) {
                        if (column.value > 0.4){
                          //console.log(column.value);
                          count += 1;
                        }
                     });
                  });
                connection.execSql(request);
            }
            else{
                console.log('wrong type');
            }
          };
        });
}