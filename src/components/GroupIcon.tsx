import { Avatar } from "native-base";
import React from "react";

type GroupIconProps = {
  id: number;
  name: string;
};

const GroupIcon: React.FC<GroupIconProps> = ({ id, name }) => {
  return (
    <Avatar
      my={2}
      size="md"
      source={{
        uri: "https://image.flaticon.com/icons/png/512/1237/1237946.png",
      }}
    >
      {String(name.charAt(0) + name.charAt(1))}
    </Avatar>
  );
};
export default GroupIcon;
