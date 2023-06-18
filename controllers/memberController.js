const AppError = require('../utils/newAppError');
const catchAsync = require('../utils/catchAsync');
const community = require('./../DataModel/communityModel');
const role = require('./../DataModel/roleModel');
const user = require('../DataModel/userModel');
const member = require('../DataModel/memberModel');
const Snowflake = require('@theinternetfolks/snowflake/dist/index.js');

// Add Member
exports.addMember = catchAsync(async (req, res, next) => {
  const id = req.body.community;
  const userId = req.body.user;
  const roleid = req.body.role;

  const userExist = await user.find({ id: userId });
  if (!userExist[0]) {
    return next(new AppError('User does not exist', 404));
  }

  await member.updateOne(
    {
      user: userId,
      community: id,
    },
    {
      $setOnInsert: {
        id: Snowflake.Snowflake.generate(),
        user: userId,
        community: id,
        role: roleid,
        created_at: new Date(),
      },
    },
    { upsert: true, new: true },
    function (err, result) {
      if (err) {
        return next('Something went wrong!', 500);
      } else {
        // finding document in database
        member
          .findOne(
            {
              user: userId,
              community: id,
            },
            function (err, updatedDocument) {
              if (err) {
                return next('could not find the document!', 404);
              } else {
                res.status(200).json({
                  status: true,
                  content: {
                    data: updatedDocument,
                  },
                });
              }
            }
          )
          .select('-_id');
        // document finding ends here
      }
    }
  );
});

// Delete Member
exports.deleteMember = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  await member.deleteOne({ user: id });
  res.status(200).json({ status: true });
});
