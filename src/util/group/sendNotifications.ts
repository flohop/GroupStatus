import { Group } from "../../shared/types";

// send notification to every user in a group
export const sendNotifications = async (group: Group) => {
  group.members.forEach((member) => {
    sendPushNotification(group, member.expoPushToken.data);
  });
};

export async function sendPushNotification(
  group: Group,
  expoPushToken: string
) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Everyone is ready",
    body: `${group.name} is ready`,
    data: { groupId: group.groupId },
  };
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}
