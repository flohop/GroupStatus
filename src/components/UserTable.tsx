import { Button, HStack, ScrollView, Spinner, View, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { Member, Status } from "../shared/types";
import { State } from "../store";
import NoUsers from "./NoUsers";
import UserRow from "./UserRow";

type UserTableProps = {};

const UserTable: React.FC<UserTableProps> = ({}) => {
  const { state } = useSelector((state: State) => state);

  const [shown, setShown] = useState<"all" | Status>("all");

  const [members, setMembers] = useState<Member[]>(); // all members in the group

  const [shownMembers, setShownMember] = useState<Member[]>(); // the members display in the list

  const [noUser, setNoUser] = useState(false);

  useEffect(() => {
    if (state.currentGroup?.members) {
      setMembers(Array.from(state.currentGroup.members, ([_, value]) => value));
    }
  }, [state]);

  useEffect(() => {
    if (shown === "all") {
      setShownMember(members);
    } else if (shown === "active") {
      // show all active members
      setShownMember(members?.filter((mem) => mem.status === "active"));
    } else if (shown === "inactive") {
      setShownMember(members?.filter((mem) => mem.status === "inactive"));
    }
  }, [shown, members]);

  useEffect(() => {
    if (shownMembers?.length === 0) setNoUser(true);
    else {
      setNoUser(false);
    }
  }, [shownMembers]);

  return (
    <View style={styles.container}>
      <HStack space={3} mb={3} ml={5} mt={3} alignItems="center">
        <Button
          onPress={() => setShown("all")}
          style={styles.selectButton}
          size="sm"
          backgroundColor={shown === "all" ? "emerald.400" : "grey"}
        >
          All
        </Button>
        <Button
          onPress={() => setShown("active")}
          style={styles.selectButton}
          backgroundColor={shown === "active" ? "green" : "grey"}
        >
          Ready
        </Button>
        <Button
          onPress={() => setShown("inactive")}
          style={styles.selectButton}
          backgroundColor={shown === "inactive" ? "red" : "grey"}
        >
          Not Ready
        </Button>
      </HStack>

      <ScrollView>
        {noUser ? (
          <VStack space={3} mb={3} alignItems="center">
            <NoUsers shown={shown} />
          </VStack>
        ) : (
          <VStack space={3} mb={3} alignItems="center">
            {shownMembers !== undefined ? (
              shownMembers.map((mem) => {
                return <UserRow member={mem} key={mem.uid} />;
              })
            ) : (
              <Spinner size="lg" color="primary" />
            )}
          </VStack>
        )}
      </ScrollView>
    </View>
  );
};
export default UserTable;

const styles = StyleSheet.create({
  container: { flex: 1 },
  text: { margin: 6 },
  selectButton: {
    height: 35,
  },
});
