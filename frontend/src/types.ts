export interface User {
    _id: string;
    username: string;
    profilePicture?: string;
  }
  
  export interface FullUser extends User {
    email: string;
    isVerified?: boolean;
  }
  
  export interface Place {
    name: string;
    date: Date;
    latitude: number;
    longitude: number;
    order: number;
  }
  
  export interface Trip {
    _id: string;
    title: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    places: Place[];
    creator: User;
    sharedWith: User[];
    invitationCode?: string;
  }

  export interface ExtTrip extends Trip {
    activeEditors: number;
  }
  
  // You can also include the request payload interfaces here if you want them to be globally available
  export interface Credentials {
    email: string;
    password: string;
  }
  
  export interface UserData {
    username: string;
    email: string;
    password: string;
  }
  
  export interface TripData {
    title: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    places: Place[];
    creator?: string;
    sharedWith?: string[];
    invitationCode?: string;
  }

  export interface updateTripData {
    title: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    places: Place[];
  }