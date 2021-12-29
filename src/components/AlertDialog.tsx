import { AlertDialog, Button } from "native-base";
import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CurrentUserContext } from "../shared/types";
import { State } from "../store";
import { clearStore } from "../store/action-creators";
import { leaveGroupFirebase } from "../util/group/leaveGroup";
import { currentUserContext } from "./auth/CurrentUserProvider";

const AlertDialogComponent: React.FC<{}> = ({}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, deleteUser, logoutUser } = useContext(
    currentUserContext
  ) as CurrentUserContext;
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();
  const dispatch = useDispatch();

  const { state } = useSelector((state: State) => state);

  // Dialog to show when the user wants to delete his profile
  const deleteHandler = async () => {
    // leave all groups
    if (user) {
      state.groups.forEach((g) => {
        leaveGroupFirebase(g, user);
      });
      console.log("left all groups");

      const deleted = await deleteUser();
      logoutUser();
      if (deleted) {
        dispatch(clearStore());
      } else {
        // Show error text
        console.log("Something went wrong deleting the user");
      }
    } else {
      console.log("No current user. Could not delete");
    }
  };

  return (
    <>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <AlertDialog.Content>
          <AlertDialog.Header>Delete Account</AlertDialog.Header>
          <AlertDialog.Body>
            Are you sure? You can't undo this action afterwards.
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button ref={cancelRef} onPress={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onPress={deleteHandler} ml={3}>
              Delete
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
      <Button
        colorScheme="danger"
        variant="outline"
        onPress={() => setIsOpen(!isOpen)}
        mx={8}
      >
        Delete Account
      </Button>
    </>
  );
};

export default AlertDialogComponent;
