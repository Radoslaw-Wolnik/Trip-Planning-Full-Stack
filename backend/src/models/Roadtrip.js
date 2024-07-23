import mongoose from 'mongoose';

const roadtripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  locations: [{
    type: String,
    required: true,
  }],
});

const Roadtrip = mongoose.model('Roadtrip', roadtripSchema);

export default Roadtrip;
