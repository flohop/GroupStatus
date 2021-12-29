export type CurrentUserContext = {
  user: User | undefined;
  deleteUser: () => Promise<boolean>;
  logoutUser: () => Promise<void>;
};

export type User = {
  displayName: string;
  email: string;
  phoneNumber: number | null;
  photoUrl: string;
  provider: "password" | "facebook.com" | "google.com";
  uid: string;
  expoPushToken: {
    data: string;
    type: "expo";
  };
};

export type Status = "active" | "inactive";

export type Member = {
  isAdmin: boolean;
  name: string;
  status: Status;
  uid: string;
  photoUrl: string;
  expoPushToken: {
    data: string;
    type: "expo";
  };
};

export type Group = {
  name: string;
  groupId: string;
  iconUrl?: string;
  membersArray: string[];
  members: Map<string, Member>;
  everyoneIsReady: boolean; // true, if every is active
};

export type Groups = Group[];
