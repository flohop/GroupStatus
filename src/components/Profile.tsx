import {
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  Heading,
  Image,
  Input,
  ScrollView,
  Stack,
  Text,
  useColorModeValue,
} from "native-base";
import React, { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { CurrentUserContext } from "../shared/types";
import { clearStore } from "../store/action-creators";
import CustomAlert from "./AlertDialog";
import { currentUserContext } from "./auth/CurrentUserProvider";

type ProfileProps = {};

const Profile: React.FC<ProfileProps> = ({}) => {
  const variant = useColorModeValue("solid", "outline");
  const { user, logoutUser } = useContext(
    currentUserContext
  ) as CurrentUserContext;

  const dispatch = useDispatch();

  const [logoutEnabled, setLogoutEnabled] = useState(true);

  // colors
  const backgroundColor = useColorModeValue("white", "#40444b"); // light, dark

  if (user === null) {
    return <Text>Could not load user</Text>;
  }

  const logout = async () => {
    let unmounted = false;
    setLogoutEnabled(false);
    dispatch(clearStore());
    logoutUser().finally(() => {
      if (!unmounted) {
        setLogoutEnabled(true);
      }
    });
    return () => {
      unmounted = true;
    };
  };

  return (
    <Box flex={1} backgroundColor={backgroundColor}>
      <Box flex={1} minH="80px" flexDirection="row">
        <Box flex={1} justifyContent="center" alignItems="center">
          <Image
            source={{
              uri:
                user?.photoUrl ||
                "https://image.flaticon.com/icons/png/512/456/456212.png",
            }}
            alt="User Profile Picture"
            size="lg"
            borderRadius={100}
          />
        </Box>

        <Box flex={2}>
          <Center flex={1}>
            <Heading size="2xl">{user?.displayName}</Heading>
          </Center>
        </Box>
      </Box>

      <Box flex={5}>
        <ScrollView flex={1}>
          <FormControl isInvalid>
            <Stack mx={8}>
              <FormControl.Label my={1}>Email</FormControl.Label>
              <Input
                value={user?.email || "Your emails should be here ):"}
                isDisabled={true}
                placeholder="Your email should appear here"
                my={0}
              />
            </Stack>
          </FormControl>

          <Divider my={4} />

          <Button
            mx={8}
            my={4}
            onPress={logout}
            colorScheme="danger"
            disabled={!logoutEnabled}
            isLoading={!logoutEnabled}
          >
            Logout
          </Button>

          <CustomAlert />
        </ScrollView>
      </Box>
    </Box>
  );
};

export default Profile;
