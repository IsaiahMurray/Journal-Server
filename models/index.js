const UserModel = require('./user');
const JournalModel = require('./journal');


UserModel.hasMany(JournalModel, {
    as: 'journals',
    foreignKey:'owner'
});

JournalModel.belongsTo(UserModel);

module.exports ={
    UserModel,
    JournalModel
};