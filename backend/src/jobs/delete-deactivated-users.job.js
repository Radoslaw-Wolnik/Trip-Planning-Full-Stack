import User from '../models/user.model';

export const deleteDeactivatedUsers = async () => {
  try {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const result = await User.deleteMany({
      deactivated: { $lt: oneWeekAgo }
    });
    console.log(`Deleted ${result.deletedCount} deactivated users`);
  } catch (error) {
    console.log('Error deleting deactivated users', error);
  }
};