const AppError = require('../utils/newAppError');
const catchAsync = require('../utils/catchAsync');
const role = require('./../DataModel/roleModel');
// Create role

exports.createRole = catchAsync(async (req, res, next) => {
  const roleName = req.body.name;
  if (roleName === 'Community Admin' || roleName === 'Community Member') {
    const newRole = await role.create({ name: roleName });
    res.status(200).json({
      status: true,
      content: {
        data: newRole,
      },
    });
  } else {
    next(new AppError('Invalid Role name', 401));
  }
});

// Get All Role

exports.getAllrole = catchAsync(async (req, res, next) => {
  const Allrole = await role.find();
  res.status(200).json({
    status: true,
    content: {
      meta: {
        total: Allrole.length,
        pages: 1,
        page: 1,
      },
      data: [Allrole],
    },
  });
});
