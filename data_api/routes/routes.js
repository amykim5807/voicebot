
module.exports = function(app) {
    var audience = require('../controllers/audienceController.js');
    var interview = require('../controllers/interviewController.js');
    app.route('/audience').get(audience.getAudience); //Requires Campaign
    app.route('/interviewid').get(interview.getInterviewID); //Requires Campaign
    app.route('/interviewQuestions').get(interview.getInterviewQuestions); //Requires id input
    app.route('/interviewAnswers').get(interview.getInterviewAnswers); //Requires question id
}
