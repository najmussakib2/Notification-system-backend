import { USER_ROLE } from '../modules/User/user.constant';
import { User } from '../modules/User/user.model';

const student = {
  name: 'John Doe',
  email: 'user@gmail.com',
  password: 12345,
  needsPasswordChange: false,
  role: USER_ROLE.user,
  status: 'in-progress',
  isDeleted: false,
};
const admin = {
  name: 'Admin',
  email: 'admin@gmail.com',
  password: 12345,
  needsPasswordChange: false,
  role: USER_ROLE.admin,
  status: 'in-progress',
  isDeleted: false,
};

const seedSuperUser = async () => {

  const isStudentExist = await User.findOne({ role: USER_ROLE.user });
  
  if (!isStudentExist) {
    await User.create(student);
  }

  const isAdminExist = await User.findOne({ role: USER_ROLE.admin });

  if (!isAdminExist) {
    await User.create(admin);
  }
};

export default seedSuperUser;
