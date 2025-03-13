"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { CirclePlus, Trash2 } from "lucide-react";
import { Control, Root, Field, Label } from "@radix-ui/react-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Modal from "@/components/modal";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

interface AddUserForm {
  firstName: string;
  lastName: string;
  email: string;
}

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);

  const [modalType, setModalType] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);

  const [addUser, setAddUser] = useState<AddUserForm>({
    firstName: "",
    lastName: "",
    email: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios("http://localhost:3001/users");

      if (result.request.status !== 200) {
        return console.error("Error fetching data");
      }
      setUsers(result.data);
    };
    fetchData();
  }, []);

  const handleCreateUser = async () => {
    try {
      const result = await axios.post("http://localhost:3001/users", addUser);

      if (result.status === 201) {
        setUsers([...users, result.data]);
        setOpenModal(false);
        setModalType(null);

        setAddUser({
          firstName: "",
          lastName: "",
          email: "",
        });
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleDeleteUser = async () => {
    const result = await axios.delete(
      `http://localhost:3001/users/${idToDelete}`
    );
    if (result.request.status === 200) {
      setUsers(users.filter((user) => user.id !== idToDelete));
    } else {
      console.error("Error deleting user");
    }
    setIdToDelete(null);
    setOpenModal(false);
    setModalType(null);
  };

  const renderModal = () => {
    switch (modalType) {
      case "create": {
        return (
          <Modal
            modalContent={
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-base font-semibold text-gray-900"
                  id="modal-title"
                >
                  Create User
                </h3>
                <div className="mt-2">
                  <div className="mt-2">
                    <Root
                      className="space-y-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleCreateUser();
                      }}
                    >
                      <Field name="firstName" className="flex flex-col">
                        <Label className="mb-2">First Name</Label>
                        <Control
                          type="input"
                          name="firstName"
                          required
                          className="border border-black rounded px-4 py-2"
                          onChange={(e) =>
                            setAddUser({
                              ...addUser,
                              firstName: e.target.value,
                            })
                          }
                          value={addUser.firstName}
                        />
                      </Field>
                      <Field name="lastName" className="flex flex-col">
                        <Label className="mb-2">Last Name</Label>
                        <Control
                          type="input"
                          name="lastName"
                          required
                          className="border border-black rounded px-4 py-2"
                          onChange={(e) =>
                            setAddUser({ ...addUser, lastName: e.target.value })
                          }
                          value={addUser.lastName}
                        />
                      </Field>
                      <Field name="email" className="flex flex-col">
                        <Label className="mb-2">Email</Label>
                        <Control
                          type="email"
                          name="email"
                          required
                          className="border border-black rounded px-4 py-2"
                          onChange={(e) =>
                            setAddUser({ ...addUser, email: e.target.value })
                          }
                          value={addUser.email}
                        />
                      </Field>
                    </Root>
                  </div>
                </div>
              </div>
            }
            modalType="create"
            primaryBtnText="Create"
            primaryBtnFn={handleCreateUser}
            secondaryBtnText="Cancel"
            secondaryBtnFn={() => setOpenModal(false)}
          />
        );
      }
      case "delete": {
        return (
          <Modal
            modalContent={
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-base font-semibold text-gray-900"
                  id="modal-title"
                >
                  Delete User
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete this user? All of your data
                    will be permanently removed. This action cannot be undone.
                  </p>
                </div>
              </div>
            }
            modalType="delete"
            primaryBtnText="Delete"
            primaryBtnFn={handleDeleteUser}
            secondaryBtnText="Cancel"
            secondaryBtnFn={() => setOpenModal(false)}
          />
        );
      }
    }
  };

  return (
    <div id="page" className="p-4">
      {openModal && renderModal()}
      <Table>
        <TableHeader>
          <TableRow>
            <Button
              className="cursor-pointer"
              onClick={() => {
                setOpenModal(true);
                setModalType("create");
              }}
            >
              <CirclePlus />
              Add user
            </Button>
            <TableHead className="w-[100px]">First Name</TableHead>
            <TableHead className="w-[100px]">Last Name</TableHead>
            <TableHead className="w-[100px]">Email</TableHead>
          </TableRow>
        </TableHeader>
        {users.length > 0 && (
          <TableBody>
            {users.map(({ id, firstName, lastName, email }) => (
              <TableRow key={id}>
                <Trash2
                  className="cursor-pointer"
                  onClick={() => {
                    setOpenModal(true);
                    setModalType("delete");
                    setIdToDelete(id);
                  }}
                />
                <TableCell className="font-medium">{firstName}</TableCell>
                <TableCell className="font-medium">{lastName}</TableCell>
                <TableCell className="font-medium">{email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </div>
  );
}
