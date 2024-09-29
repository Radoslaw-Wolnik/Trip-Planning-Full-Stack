import User from '../models/user.model.js';



export const getUserProfile = async (req, res) => {
  console.log("backend is trying");
  //console.log('data: ', req.user);

  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      console.log('user not found ughhh');
      return res.status(404).json({ message: 'User not found' });
    }
    //console.log('user found:', user);
    console.log("user found succesfully");
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Store the relative path in the database
    const relativePath = `/uploads/profile_pics/${req.user.id}/${req.file.filename}`;
    user.profilePicture = relativePath;
    await user.save();

    res.json({ 
      message: 'Profile picture updated successfully', 
      profilePicture: relativePath 
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
