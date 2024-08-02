"use client";

import { getUsers } from "@/lib/api";
import { useState, useEffect, type FC } from "react";

const UserList: FC = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then(async (res) => {
      if (res.ok) {
        const { list } = await res.json();
        setUsers(list ?? []);
      }
    });
    return;
  }, []);

  return (
    <div>
      <div className="text-2xl">LIST</div>
      {users.length &&
        users.map((item: any) => {
          return (
            <div key={item.id}>{item.id + " ====>>>> " + item.username}</div>
          );
        })}
    </div>
  );
};

export default UserList;
